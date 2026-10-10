import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../module-user/entity/user.entity';
import { Patient } from '../module-patient/entity/patient.entity';
import { Consultation } from '../module-consultation/entity/consultation.entity';
import { ClinicalRecord } from './entity/clinical-record.entity';
import { MedicalHistory } from './entity/medical-history.entity';
import { ClinicalDocument } from './entity/clinical-document.entity';
import {
  CreateClinicalDocumentDto,
  CreateClinicalRecordDto,
  CreateMedicalHistoryDto,
  UpdateClinicalDocumentDto,
  UpdateClinicalRecordDto,
} from './dto';

@Injectable()
export class ClinicalRecordService {
  constructor(
    @InjectRepository(ClinicalRecord)
    private records: Repository<ClinicalRecord>,
    @InjectRepository(MedicalHistory)
    private histories: Repository<MedicalHistory>,
    @InjectRepository(ClinicalDocument)
    private documents: Repository<ClinicalDocument>,
    @InjectRepository(Patient) private patients: Repository<Patient>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Consultation)
    private consultations: Repository<Consultation>,
  ) {}
  findAll() {
    return this.records.find({
      relations: { patient: true },
      order: { clinicalRecordId: 'DESC' },
    });
  }
  async findOne(id: number) {
    const item = await this.records.findOne({
      where: { clinicalRecordId: id },
      relations: { patient: true },
    });
    if (!item)
      throw new NotFoundException(`Clinical record with id ${id} not found`);
    return item;
  }
  async create(dto: CreateClinicalRecordDto) {
    const patient = await this.patients.findOneBy({ patientId: dto.patientId });
    if (!patient)
      throw new NotFoundException(`Patient with id ${dto.patientId} not found`);
    return this.records.save(
      this.records.create({
        patient,
        recordNumber: dto.recordNumber,
        openedAt: new Date(dto.openedAt),
        status: dto.status,
      }),
    );
  }
  async update(id: number, dto: UpdateClinicalRecordDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.records.save(item);
  }
  async history(id: number) {
    await this.findOne(id);
    return this.histories.find({
      where: { clinicalRecord: { clinicalRecordId: id } },
      relations: { updater: true },
      order: { medicalHistoryId: 'DESC' },
    });
  }
  async saveHistory(id: number, userId: number, dto: CreateMedicalHistoryDto) {
    const record = await this.findOne(id);
    const updater = await this.users.findOneBy({ userId });
    if (!updater)
      throw new NotFoundException(`User with id ${userId} not found`);
    return this.histories.save(
      this.histories.create({ clinicalRecord: record, updater, ...dto }),
    );
  }
  async documentsFor(id: number) {
    await this.findOne(id);
    return this.documents.find({
      where: { clinicalRecord: { clinicalRecordId: id } },
      relations: { consultation: true, uploader: true },
      order: { clinicalDocumentId: 'DESC' },
    });
  }
  async createDocument(
    id: number,
    userId: number,
    dto: CreateClinicalDocumentDto,
  ) {
    const record = await this.findOne(id);
    const uploader = await this.users.findOneBy({ userId });
    if (!uploader)
      throw new NotFoundException(`User with id ${userId} not found`);
    const consultation = dto.consultationId
      ? await this.consultations.findOneBy({
          consultationId: dto.consultationId,
        })
      : null;
    if (dto.consultationId && !consultation)
      throw new NotFoundException(
        `Consultation with id ${dto.consultationId} not found`,
      );
    return this.documents.save(
      this.documents.create({
        clinicalRecord: record,
        uploader,
        consultation,
        ...dto,
      }),
    );
  }
  async updateDocument(
    id: number,
    documentId: number,
    dto: UpdateClinicalDocumentDto,
  ) {
    await this.findOne(id);
    const item = await this.documents.findOne({
      where: {
        clinicalDocumentId: documentId,
        clinicalRecord: { clinicalRecordId: id },
      },
    });
    if (!item)
      throw new NotFoundException(
        `Clinical document with id ${documentId} not found`,
      );
    Object.assign(item, dto);
    return this.documents.save(item);
  }
}
