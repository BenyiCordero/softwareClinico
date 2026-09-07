import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { AppDataSource } from '../src/data-source';

class MetadataDataSource extends DataSource {
  async buildSchemaMetadata() {
    await this.buildMetadatas();
  }
}

const document = readFileSync(resolve(__dirname, '../database-model.md'), 'utf8');
const sections = [...document.matchAll(/^## `([a-z_]+)`\r?\n([\s\S]*?)(?=^## `|$(?![\s\S]))/gm)].filter((section) => section[1] !== 'metric_snapshots');
const source = new MetadataDataSource({ ...AppDataSource.options, migrations: [], subscribers: [] });

beforeAll(async () => {
  await source.buildSchemaMetadata();
});

describe('Database model', () => {
  it('registers exactly the 46 initial tables without synchronizing or connecting', () => {
    expect(sections).toHaveLength(46);
    expect(source.entityMetadatas.map((entity) => entity.tableName).sort()).toEqual(sections.map((section) => section[1]).sort());
    expect(source.options.synchronize).toBe(false);
    expect(source.isInitialized).toBe(false);
  });

  it.each(sections.map((section) => [section[1], section[2]]))('matches documented columns, enums and foreign keys for %s', (table, section) => {
    const entity = source.entityMetadatas.find((metadata) => metadata.tableName === table)!;
    const attributes = section.split('### Atributos')[1].split(/\r?\n### |\r?\n---/)[0];
    const fields = [...attributes.matchAll(/^\* `([a-z_]+)`([^\r\n]*)/gm)];
    expect(entity.columns.map((column) => column.databaseName).sort()).toEqual(fields.map((field) => field[1]).sort());
    expect(entity.primaryColumns.map((column) => column.databaseName)).toEqual(['id']);
    expect(entity.primaryColumns[0].isGenerated).toBe(true);
    expect(entity.primaryColumns[0].generationStrategy).toBe('increment');

    for (const [, name, description] of fields) {
      const column = entity.columns.find((candidate) => candidate.databaseName === name)!;
      expect(column.isNullable, `${table}.${name}`).toBe(description.includes('nullable'));
      const enumName = description.match(/→ `([^`]+)`/)?.[1];
      if (enumName) {
        const enumSection = document.split(`### ENUM \`${enumName}\``)[1].split(/\r?\n### |\r?\n---/)[0];
        const values = [...enumSection.matchAll(/^\* `([^`]+)`/gm)].map((value) => value[1]);
        expect(column.type).toBe('enum');
        expect(column.enum).toEqual(values);
        expect(column.default).toBeUndefined();
      }
    }

    const references = [...section.matchAll(/^\* `([a-z_]+) → ([a-z_]+)\.id`/gm)];
    expect(entity.foreignKeys).toHaveLength(references.length);
    for (const [, columnName, target] of references) {
      const foreignKey = entity.foreignKeys.find((key) => key.columnNames.includes(columnName))!;
      expect(foreignKey.referencedTablePath).toBe(target);
      expect(foreignKey.referencedColumnNames).toEqual(['id']);
    }
  });

  it('enforces only the documented unique pairs and patient-record cardinality', () => {
    const constraints = source.entityMetadatas.flatMap((entity) => entity.uniques.map((unique) => `${entity.tableName}:${unique.columns.map((column) => column.databaseName).sort().join(',')}`));
    expect(constraints.sort()).toEqual(['clinical_records:patient_id', 'price_list_details:price_list_id,service_id', 'role_permissions:permission_id,role_id']);
    expect(source.entityMetadatas.flatMap((entity) => entity.indices)).toHaveLength(0);
    expect(source.entityMetadatas.flatMap((entity) => entity.checks)).toHaveLength(0);
  });

  it('preserves decimal precision, timestamps and nullable deletion dates', () => {
    for (const entity of source.entityMetadatas) {
      for (const column of entity.columns) {
        if (column.type === 'numeric') {
          expect(column.precision).toBe(14);
          expect(column.scale).toBe(2);
          expect(column.transformer).toBeUndefined();
        }
        if (column.databaseName.endsWith('_at')) expect(column.type).toBe('timestamptz');
        expect(column.type).not.toBe('boolean');
      }
      expect(entity.deleteDateColumn).toBeUndefined();
      for (const relation of entity.relations) {
        expect(relation.isCascadeInsert).toBe(false);
        expect(relation.isCascadeUpdate).toBe(false);
        expect(relation.isCascadeRemove).toBe(false);
      }
    }
  });

  it('registers every entity repository through the root feature modules', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as Function[];
    const features = imports.filter((module) => typeof module === 'function' && !['AppConfigModule', 'DatabaseModule', 'LoggerConfigModule'].includes(module.name));
    expect(features).toHaveLength(27);
    const tokens = features.flatMap((module) => (Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) as { providers: { provide: unknown }[] }[]).flatMap((registration) => registration.providers.map((provider) => provider.provide)));
    expect(tokens).toHaveLength(46);
    expect(new Set(tokens)).toEqual(new Set(source.entityMetadatas.map((entity) => getRepositoryToken(entity.target as Function))));
  });
});
