import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { PatientCategoryService } from '../module-patient-category/patient-category.service';
import { PatientCategoryStatus } from '../module-patient-category/enum/patient-category-status.enum';
import { PersonService } from '../module-person/person.service';
import { CreateEmergencyContactDto } from './dto/request/create-emergency-contact.dto';
import { CreatePatientDto } from './dto/request/create-patient.dto';
import { FindPatientQueryDto } from './dto/request/find-patient-query.dto';
import { UpdateEmergencyContactDto } from './dto/request/update-emergency-contact.dto';
import { UpdatePatientDto } from './dto/request/update-patient.dto';
import { PatientMapper } from './dto/patient.mapper';
import { EmergencyContactResponseDto } from './dto/response/emergency-contact-response.dto';
import { PatientResponseDto } from './dto/response/patient-response.dto';
import { EmergencyContact } from './entity/emergency-contact.entity';
import { Patient } from './entity/patient.entity';
import { ContactPriority } from './enum/contact-priority.enum';
import { EmergencyContactStatus } from './enum/emergency-contact-status.enum';
import { PatientStatus } from './enum/patient-status.enum';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(EmergencyContact) private readonly contactRepository: Repository<EmergencyContact>,
    private readonly personService: PersonService,
    private readonly patientCategoryService: PatientCategoryService,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: FindPatientQueryDto = {}): Promise<OffsetPaginatedResult<PatientResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.patientRepository.createQueryBuilder('patient')
      .leftJoinAndSelect('patient.person', 'person')
      .leftJoinAndSelect('patient.patientCategory', 'category')
      .leftJoinAndSelect('patient.emergencyContacts', 'contact', 'contact.status = :contactStatus', { contactStatus: EmergencyContactStatus.ACTIVE })
      .orderBy('person.lastName', 'ASC').addOrderBy('person.firstName', 'ASC');
    if (filters.search) {
      query.andWhere(new Brackets((where) => where
        .where('person.firstName ILIKE :search', { search: `%${filters.search}%` })
        .orWhere('person.lastName ILIKE :search', { search: `%${filters.search}%` })
        .orWhere('person.secondLastName ILIKE :search', { search: `%${filters.search}%` })
        .orWhere('patient.patientNumber ILIKE :search', { search: `%${filters.search}%` })));
    }
    if (filters.patientNumber) query.andWhere('patient.patientNumber = :patientNumber', { patientNumber: filters.patientNumber });
    if (filters.patientCategoryId) query.andWhere('category.patientCategoryId = :patientCategoryId', { patientCategoryId: filters.patientCategoryId });
    if (filters.status) query.andWhere('patient.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return { data: entities.map(PatientMapper.toResponseDto), pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 } };
  }

  async findOne(id: number): Promise<PatientResponseDto> {
    return PatientMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreatePatientDto): Promise<PatientResponseDto> {
    const category = await this.patientCategoryService.findEntityById(idOrThrow(dto.patientCategoryId));
    if (category.status !== PatientCategoryStatus.ACTIVE) throw new BadRequestException('Only an active patient category can be assigned');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const person = await this.personService.createEntity(dto.person, queryRunner.manager);
      const patient = queryRunner.manager.getRepository(Patient).create({
        person,
        patientCategory: category,
        patientNumber: await this.nextPatientNumber(queryRunner.manager),
        bloodType: dto.bloodType ?? null,
        allergiesSummary: dto.allergiesSummary ?? null,
        status: PatientStatus.ACTIVE,
        registeredAt: new Date(),
      });
      const saved = await queryRunner.manager.getRepository(Patient).save(patient);
      await queryRunner.commitTransaction();
      return this.findOne(saved.patientId);
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw this.databaseExceptionMapper.fromTypeOrmError(error, {});
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.findByIdOrThrow(id);
    if (dto.person) await this.personService.updateEntity(patient.person.personId, dto.person);
    if (dto.patientCategoryId !== undefined) {
      const category = await this.patientCategoryService.findEntityById(dto.patientCategoryId);
      if (category.status !== PatientCategoryStatus.ACTIVE) throw new BadRequestException('Only an active patient category can be assigned');
      patient.patientCategory = category;
    }
    if (dto.bloodType !== undefined) patient.bloodType = dto.bloodType;
    if (dto.allergiesSummary !== undefined) patient.allergiesSummary = dto.allergiesSummary;
    if (dto.status !== undefined) patient.status = dto.status;
    await this.patientRepository.save(patient);
    return this.findOne(id);
  }

  async archive(id: number): Promise<void> {
    const patient = await this.findByIdOrThrow(id);
    patient.status = PatientStatus.INACTIVE;
    await this.patientRepository.save(patient);
  }

  async findContacts(patientId: number): Promise<EmergencyContactResponseDto[]> {
    await this.findByIdOrThrow(patientId);
    const contacts = await this.contactRepository.find({ where: { patient: { patientId }, status: EmergencyContactStatus.ACTIVE }, order: { priority: 'ASC', name: 'ASC' } });
    return contacts.map(PatientMapper.toContactResponse);
  }

  async createContact(patientId: number, dto: CreateEmergencyContactDto): Promise<EmergencyContactResponseDto> {
    const patient = await this.findByIdOrThrow(patientId);
    await this.ensurePrimaryContact(patientId, dto.priority);
    const contact = this.contactRepository.create({ ...dto, patient, secondaryPhone: dto.secondaryPhone ?? null, email: dto.email ?? null, status: EmergencyContactStatus.ACTIVE });
    return PatientMapper.toContactResponse(await this.contactRepository.save(contact));
  }

  async updateContact(patientId: number, contactId: number, dto: UpdateEmergencyContactDto): Promise<EmergencyContactResponseDto> {
    const contact = await this.findContactOrThrow(patientId, contactId);
    if (dto.priority) await this.ensurePrimaryContact(patientId, dto.priority, contactId);
    this.contactRepository.merge(contact, { ...dto, secondaryPhone: dto.secondaryPhone === undefined ? contact.secondaryPhone : dto.secondaryPhone, email: dto.email === undefined ? contact.email : dto.email });
    return PatientMapper.toContactResponse(await this.contactRepository.save(contact));
  }

  async archiveContact(patientId: number, contactId: number): Promise<void> {
    const contact = await this.findContactOrThrow(patientId, contactId);
    contact.status = EmergencyContactStatus.INACTIVE;
    await this.contactRepository.save(contact);
  }

  private async findByIdOrThrow(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { patientId: id }, relations: { person: true, patientCategory: true, emergencyContacts: true } });
    if (!patient) throw new NotFoundException(`Patient with id ${id} not found`);
    patient.emergencyContacts = patient.emergencyContacts.filter((contact) => contact.status === EmergencyContactStatus.ACTIVE);
    return patient;
  }

  private async findContactOrThrow(patientId: number, contactId: number): Promise<EmergencyContact> {
    const contact = await this.contactRepository.findOne({ where: { emergencyContactId: contactId, patient: { patientId }, status: EmergencyContactStatus.ACTIVE } });
    if (!contact) throw new NotFoundException(`Emergency contact with id ${contactId} not found for patient ${patientId}`);
    return contact;
  }

  private async ensurePrimaryContact(patientId: number, priority: ContactPriority, excludeId?: number): Promise<void> {
    if (priority !== ContactPriority.PRIMARY) return;
    const query = this.contactRepository.createQueryBuilder('contact').where('contact.patient_id = :patientId', { patientId }).andWhere('contact.status = :status', { status: EmergencyContactStatus.ACTIVE }).andWhere('contact.priority = :priority', { priority });
    if (excludeId) query.andWhere('contact.emergency_contact_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException('The patient already has a primary emergency contact');
  }

  private async nextPatientNumber(manager: import('typeorm').EntityManager): Promise<string> {
    const result = await manager.getRepository(Patient).createQueryBuilder('patient').select('COUNT(patient.patient_id)', 'count').getRawOne<{ count: string }>();
    return `P-${String(Number(result?.count ?? 0) + 1).padStart(6, '0')}`;
  }
}

function idOrThrow(value: number): number {
  if (!value || value < 1) throw new BadRequestException('patientCategoryId must be a positive integer');
  return value;
}
