import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { PERSON_CONSTRAINT_MAP } from './const/person.constraint';
import { CreatePersonDto } from './dto/request/create-person.dto';
import { FindPersonQueryDto } from './dto/request/find-person-query.dto';
import { UpdatePersonDto } from './dto/request/update-person.dto';
import { PersonMapper } from './dto/person.mapper';
import { PersonResponseDto } from './dto/response/person-response.dto';
import { Person } from './entity/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private readonly repository: Repository<Person>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(filters: FindPersonQueryDto = {}): Promise<OffsetPaginatedResult<PersonResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository
      .createQueryBuilder('person')
      .where('person.deleted_at IS NULL')
      .orderBy('person.lastName', 'ASC')
      .addOrderBy('person.firstName', 'ASC');
    if (filters.name) {
      query.andWhere(new Brackets((where) => {
        where.where('person.firstName ILIKE :name', { name: `%${filters.name}%` })
          .orWhere('person.middleName ILIKE :name', { name: `%${filters.name}%` })
          .orWhere('person.lastName ILIKE :name', { name: `%${filters.name}%` })
          .orWhere('person.secondLastName ILIKE :name', { name: `%${filters.name}%` });
      }));
    }
    if (filters.curp) query.andWhere('person.curp = :curp', { curp: filters.curp.trim().toUpperCase() });
    if (filters.rfc) query.andWhere('person.rfc = :rfc', { rfc: filters.rfc.trim().toUpperCase() });
    if (filters.phone) query.andWhere('person.phone ILIKE :phone', { phone: `%${filters.phone}%` });
    if (filters.email) query.andWhere('person.email ILIKE :email', { email: `%${filters.email}%` });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(PersonMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async findOne(id: number): Promise<PersonResponseDto> {
    return PersonMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreatePersonDto): Promise<PersonResponseDto> {
    await this.ensureIdentifiersAvailable(dto.curp ?? null, dto.rfc ?? null);
    try {
      const person = this.repository.create({
        ...dto,
        middleName: dto.middleName ?? null,
        secondLastName: dto.secondLastName ?? null,
        curp: dto.curp ?? null,
        rfc: dto.rfc ?? null,
        secondaryPhone: dto.secondaryPhone ?? null,
        email: dto.email ?? null,
        address: dto.address ?? null,
        city: dto.city ?? null,
        state: dto.state ?? null,
        postalCode: dto.postalCode ?? null,
        deletedAt: null,
      });
      return PersonMapper.toResponseDto(await this.repository.save(person));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, PERSON_CONSTRAINT_MAP);
    }
  }

  async update(id: number, dto: UpdatePersonDto): Promise<PersonResponseDto> {
    const person = await this.findByIdOrThrow(id);
    const curp = dto.curp === undefined ? person.curp : dto.curp;
    const rfc = dto.rfc === undefined ? person.rfc : dto.rfc;
    await this.ensureIdentifiersAvailable(curp, rfc, id);
    try {
      return PersonMapper.toResponseDto(await this.repository.save(this.repository.merge(person, dto)));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, PERSON_CONSTRAINT_MAP);
    }
  }

  async remove(id: number): Promise<void> {
    const person = await this.findByIdOrThrow(id);
    if (person.deletedAt) return;
    person.deletedAt = new Date();
    await this.repository.save(person);
  }

  private async findByIdOrThrow(id: number): Promise<Person> {
    const person = await this.repository
      .createQueryBuilder('person')
      .where('person.personId = :id', { id })
      .andWhere('person.deleted_at IS NULL')
      .getOne();
    if (!person) throw new NotFoundException(`Person with id ${id} not found`);
    return person;
  }

  private async ensureIdentifiersAvailable(curp: string | null, rfc: string | null, excludeId?: number): Promise<void> {
    if (curp) {
      const query = this.repository.createQueryBuilder('person').where('person.curp = :curp', { curp });
      if (excludeId) query.andWhere('person.person_id != :excludeId', { excludeId });
      if (await query.getExists()) throw new ConflictException(`Person curp ${curp} is already in use`);
    }
    if (rfc) {
      const query = this.repository.createQueryBuilder('person').where('person.rfc = :rfc', { rfc });
      if (excludeId) query.andWhere('person.person_id != :excludeId', { excludeId });
      if (await query.getExists()) throw new ConflictException(`Person rfc ${rfc} is already in use`);
    }
  }
}
