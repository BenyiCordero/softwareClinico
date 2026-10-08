import { Test } from '@nestjs/testing';
import { Global, Module, ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AppDataSource } from '../src/data-source';
import { DatabaseModule } from '../src/common/module/database.module';

class MetadataDataSource extends DataSource {
  async buildSchemaMetadata() {
    await this.buildMetadatas();
  }
}

const source = new MetadataDataSource({ ...AppDataSource.options, migrations: [], subscribers: [] });

@Global()
@Module({ providers: [{ provide: DataSource, useValue: source }], exports: [DataSource] })
class TestDatabaseModule {}

describe('Application model registration (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    await source.buildSchemaMetadata();
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).overrideModule(DatabaseModule).useModule(TestDatabaseModule).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v2');
    await app.init();
  });

  it('resolves all 46 feature repositories without a database connection', () => {
    expect(source.entityMetadatas).toHaveLength(46);
    for (const entity of source.entityMetadatas) {
      const repository = app.get<Repository<object>>(getRepositoryToken(entity.target as Function));
      expect(repository.metadata).toBe(entity);
    }
    expect(source.isInitialized).toBe(false);
  });

  it('does not expose endpoints outside the modeling scope', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
    await request(app.getHttpServer()).get('/api/v2').expect(404);
  });

  afterAll(async () => {
    await app?.close();
  });
});
