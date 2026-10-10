import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../module-appointment/entity/appointment.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { Service } from '../module-service/entity/service.entity';
import { ClinicalRecord } from '../module-clinical-record/entity/clinical-record.entity';
import { Consultation } from './entity/consultation.entity';
import { Diagnosis } from './entity/diagnosis.entity';
import { Treatment } from './entity/treatment.entity';
import { ClinicalNote } from './entity/clinical-note.entity';
import {
  CreateClinicalNoteDto,
  CreateConsultationDto,
  CreateDiagnosisDto,
  CreateTreatmentDto,
  UpdateConsultationDto,
} from './dto';
@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultations: Repository<Consultation>,
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(ClinicalNote) private notes: Repository<ClinicalNote>,
    @InjectRepository(ClinicalRecord)
    private records: Repository<ClinicalRecord>,
    @InjectRepository(Appointment)
    private appointments: Repository<Appointment>,
    @InjectRepository(HealthProfessional)
    private professionals: Repository<HealthProfessional>,
    @InjectRepository(Branch) private branches: Repository<Branch>,
    @InjectRepository(ConsultingRoom) private rooms: Repository<ConsultingRoom>,
    @InjectRepository(Service) private services: Repository<Service>,
  ) {}
  findAll() {
    return this.consultations.find({
      relations: {
        clinicalRecord: true,
        healthProfessional: true,
        branch: true,
        appointment: true,
      },
      order: { consultationId: 'DESC' },
    });
  }
  async findOne(id: number) {
    const item = await this.consultations.findOne({
      where: { consultationId: id },
      relations: {
        clinicalRecord: true,
        healthProfessional: true,
        branch: true,
        appointment: true,
        consultingRoom: true,
        service: true,
      },
    });
    if (!item)
      throw new NotFoundException(`Consultation with id ${id} not found`);
    return item;
  }
  async create(dto: CreateConsultationDto) {
    const [
      clinicalRecord,
      appointment,
      healthProfessional,
      branch,
      consultingRoom,
      service,
    ] = await Promise.all([
      this.records.findOneBy({ clinicalRecordId: dto.clinicalRecordId }),
      dto.appointmentId
        ? this.appointments.findOneBy({ appointmentId: dto.appointmentId })
        : null,
      this.professionals.findOneBy({
        healthProfessionalId: dto.healthProfessionalId,
      }),
      this.branches.findOneBy({ branchId: dto.branchId }),
      dto.consultingRoomId
        ? this.rooms.findOneBy({ consultingRoomId: dto.consultingRoomId })
        : null,
      dto.serviceId
        ? this.services.findOneBy({ serviceId: dto.serviceId })
        : null,
    ]);
    if (
      !clinicalRecord ||
      (dto.appointmentId && !appointment) ||
      !healthProfessional ||
      !branch ||
      (dto.consultingRoomId && !consultingRoom) ||
      (dto.serviceId && !service)
    )
      throw new NotFoundException(
        'One or more consultation relations were not found',
      );
    return this.consultations.save(
      this.consultations.create({
        clinicalRecord,
        appointment: appointment ?? null,
        healthProfessional,
        branch,
        consultingRoom: consultingRoom ?? null,
        service: service ?? null,
        reason: dto.reason,
        clinicalSummary: dto.clinicalSummary ?? null,
        startedAt: new Date(dto.startedAt),
        status: dto.status,
        finishedAt: null,
      }),
    );
  }
  async update(id: number, dto: UpdateConsultationDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto, {
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : item.finishedAt,
    });
    return this.consultations.save(item);
  }
  async diagnoses(id: number) {
    await this.findOne(id);
    return this.diagnosisRepository.find({
      where: { consultation: { consultationId: id } },
      order: { diagnosisId: 'DESC' },
    });
  }
  async addDiagnosis(id: number, dto: CreateDiagnosisDto) {
    const consultation = await this.findOne(id);
    return this.diagnosisRepository.save(
      this.diagnosisRepository.create({
        consultation,
        ...dto,
        code: dto.code ?? null,
        notes: dto.notes ?? null,
      }),
    );
  }
  async treatments(id: number) {
    await this.findOne(id);
    return this.treatmentRepository.find({
      where: { consultation: { consultationId: id } },
      order: { treatmentId: 'DESC' },
    });
  }
  async addTreatment(id: number, dto: CreateTreatmentDto) {
    const consultation = await this.findOne(id);
    return this.treatmentRepository.save(
      this.treatmentRepository.create({
        consultation,
        ...dto,
        startDate: dto.startDate ?? null,
        endDate: dto.endDate ?? null,
      }),
    );
  }
  async notesFor(id: number) {
    await this.findOne(id);
    return this.notes.find({
      where: { consultation: { consultationId: id } },
      relations: { healthProfessional: true },
      order: { clinicalNoteId: 'DESC' },
    });
  }
  async addNote(id: number, dto: CreateClinicalNoteDto) {
    const consultation = await this.findOne(id);
    const professional = await this.professionals.findOneBy({
      healthProfessionalId: dto.healthProfessionalId,
    });
    if (!professional)
      throw new NotFoundException(
        `Health professional with id ${dto.healthProfessionalId} not found`,
      );
    return this.notes.save(
      this.notes.create({
        consultation,
        healthProfessional: professional,
        ...dto,
      }),
    );
  }
}
