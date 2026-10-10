import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { Patient } from '../module-patient/entity/patient.entity';
import { PatientStatus } from '../module-patient/enum/patient-status.enum';
import { ScheduleService } from '../module-schedule/schedule.service';
import { Schedule } from '../module-schedule/entity/schedule.entity';
import { ScheduleStatus } from '../module-schedule/enum/schedule-status.enum';
import { Service } from '../module-service/entity/service.entity';
import { ServiceStatus } from '../module-service/enum/service-status.enum';
import { User } from '../module-user/entity/user.entity';
import { Appointment } from './entity/appointment.entity';
import { AppointmentReschedule } from './entity/appointment-reschedule.entity';
import { AppointmentStatus } from './enum/appointment-status.enum';
import {
  CreateAppointmentDto,
  FindAppointmentQueryDto,
  RescheduleAppointmentDto,
  UpdateAppointmentNotesDto,
} from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointments: Repository<Appointment>,
    @InjectRepository(AppointmentReschedule)
    private readonly reschedules: Repository<AppointmentReschedule>,
    @InjectRepository(Patient) private readonly patients: Repository<Patient>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    @InjectRepository(HealthProfessional)
    private readonly professionals: Repository<HealthProfessional>,
    @InjectRepository(Service) private readonly services: Repository<Service>,
    @InjectRepository(Branch) private readonly branches: Repository<Branch>,
    @InjectRepository(ConsultingRoom)
    private readonly rooms: Repository<ConsultingRoom>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly scheduleService: ScheduleService,
  ) {}

  findAll(query: FindAppointmentQueryDto = {}) {
    const qb = this.appointments
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.schedule', 'schedule')
      .leftJoinAndSelect('appointment.healthProfessional', 'professional')
      .leftJoinAndSelect('appointment.service', 'service')
      .leftJoinAndSelect('appointment.branch', 'branch')
      .leftJoinAndSelect('appointment.consultingRoom', 'room')
      .orderBy('appointment.startAt', 'ASC');
    if (query.patientId)
      qb.andWhere('patient.patientId = :patientId', {
        patientId: query.patientId,
      });
    if (query.scheduleId)
      qb.andWhere('schedule.scheduleId = :scheduleId', {
        scheduleId: query.scheduleId,
      });
    if (query.from)
      qb.andWhere('appointment.start_at >= :from', { from: query.from });
    if (query.to) qb.andWhere('appointment.start_at < :to', { to: query.to });
    return qb.getMany();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointments.findOne({
      where: { appointmentId: id },
      relations: {
        patient: { person: true },
        schedule: true,
        healthProfessional: true,
        service: true,
        branch: true,
        consultingRoom: true,
        creator: true,
      },
    });
    if (!appointment)
      throw new NotFoundException(`Appointment with id ${id} not found`);
    return appointment;
  }

  async create(
    dto: CreateAppointmentDto,
    userId: number,
  ): Promise<Appointment> {
    const [patient, schedule, service, creator] = await Promise.all([
      this.patients.findOne({
        where: { patientId: dto.patientId },
        relations: { person: true },
      }),
      this.schedules.findOne({
        where: { scheduleId: dto.scheduleId },
        relations: {
          branch: true,
          healthProfessional: true,
          consultingRoom: true,
        },
      }),
      this.services.findOneBy({ serviceId: dto.serviceId }),
      this.users.findOneBy({ userId }),
    ]);
    if (!patient)
      throw new NotFoundException(`Patient with id ${dto.patientId} not found`);
    if (patient.status !== PatientStatus.ACTIVE)
      throw new BadRequestException(
        'Only an active patient can have an appointment',
      );
    if (!schedule)
      throw new NotFoundException(
        `Schedule with id ${dto.scheduleId} not found`,
      );
    if (!service)
      throw new NotFoundException(`Service with id ${dto.serviceId} not found`);
    if (!creator)
      throw new NotFoundException(`User with id ${userId} not found`);
    if (
      schedule.status !== ScheduleStatus.ACTIVE ||
      service.status !== ServiceStatus.ACTIVE
    )
      throw new BadRequestException('The schedule and service must be active');
    if (service.durationMinutes > schedule.slotDurationMinutes)
      throw new BadRequestException(
        'The service duration exceeds the schedule slot duration',
      );
    const startAt = new Date(dto.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMinutes * 60000);
    const available = (
      await this.scheduleService.availability(
        schedule.scheduleId,
        dto.startAt.slice(0, 10),
      )
    ).some(
      (slot) =>
        slot.startAt === startAt.toISOString() && new Date(slot.endAt) >= endAt,
    );
    if (!available)
      throw new ConflictException(
        'The requested time is not available in the schedule',
      );
    const conflict = await this.appointments
      .createQueryBuilder('appointment')
      .where('appointment.schedule_id = :scheduleId', {
        scheduleId: schedule.scheduleId,
      })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.CHECKED_IN,
          AppointmentStatus.IN_PROGRESS,
        ],
      })
      .andWhere(
        'appointment.start_at < :endAt AND appointment.end_at > :startAt',
        { startAt, endAt },
      )
      .getExists();
    if (conflict)
      throw new ConflictException(
        'The requested time overlaps another appointment',
      );
    return this.appointments.save(
      this.appointments.create({
        patient,
        schedule,
        healthProfessional: schedule.healthProfessional,
        service,
        branch: schedule.branch,
        consultingRoom: schedule.consultingRoom,
        startAt,
        endAt,
        status: AppointmentStatus.SCHEDULED,
        reasonForVisit: dto.reasonForVisit ?? null,
        notes: dto.notes ?? null,
        priceAtBooking: null,
        creator,
        confirmedAt: null,
        cancelledAt: null,
        checkedInAt: null,
        startedAt: null,
        finishedAt: null,
      }),
    );
  }

  async update(
    id: number,
    dto: UpdateAppointmentNotesDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (
      ![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
        appointment.status,
      )
    )
      throw new BadRequestException(
        'Only scheduled or confirmed appointments can be updated',
      );
    this.appointments.merge(appointment, dto);
    return this.appointments.save(appointment);
  }

  async transition(
    id: number,
    target: AppointmentStatus,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    const allowed: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.CHECKED_IN,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.CHECKED_IN]: [AppointmentStatus.IN_PROGRESS],
      [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.NO_SHOW]: [],
    };
    if (!allowed[appointment.status].includes(target))
      throw new BadRequestException(
        `Cannot transition appointment from ${appointment.status} to ${target}`,
      );
    appointment.status = target;
    const now = new Date();
    if (target === AppointmentStatus.CONFIRMED) appointment.confirmedAt = now;
    if (target === AppointmentStatus.CANCELLED) appointment.cancelledAt = now;
    if (target === AppointmentStatus.CHECKED_IN) appointment.checkedInAt = now;
    if (target === AppointmentStatus.IN_PROGRESS) appointment.startedAt = now;
    if (target === AppointmentStatus.COMPLETED) appointment.finishedAt = now;
    return this.appointments.save(appointment);
  }

  async reschedule(
    id: number,
    dto: RescheduleAppointmentDto,
    userId: number,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (
      ![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
        appointment.status,
      )
    )
      throw new BadRequestException(
        'Only scheduled or confirmed appointments can be rescheduled',
      );
    const user = await this.users.findOneBy({ userId });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    const startAt = new Date(dto.startAt);
    const endAt = new Date(
      startAt.getTime() +
        (appointment.endAt.getTime() - appointment.startAt.getTime()),
    );
    const available = (
      await this.scheduleService.availability(
        appointment.schedule.scheduleId,
        dto.startAt.slice(0, 10),
      )
    ).some(
      (slot) =>
        slot.startAt === startAt.toISOString() && new Date(slot.endAt) >= endAt,
    );
    if (!available)
      throw new ConflictException(
        'The requested time is not available in the schedule',
      );
    const conflict = await this.appointments
      .createQueryBuilder('candidate')
      .where('candidate.schedule_id = :scheduleId', {
        scheduleId: appointment.schedule.scheduleId,
      })
      .andWhere('candidate.appointment_id != :id', { id })
      .andWhere('candidate.status IN (:...statuses)', {
        statuses: [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.CHECKED_IN,
          AppointmentStatus.IN_PROGRESS,
        ],
      })
      .andWhere('candidate.start_at < :endAt AND candidate.end_at > :startAt', {
        startAt,
        endAt,
      })
      .getExists();
    if (conflict)
      throw new ConflictException(
        'The requested time overlaps another appointment',
      );
    await this.reschedules.save(
      this.reschedules.create({
        appointment,
        previousStartAt: appointment.startAt,
        previousEndAt: appointment.endAt,
        newStartAt: startAt,
        newEndAt: endAt,
        reason: dto.reason,
        changedByUser: user,
      }),
    );
    appointment.startAt = startAt;
    appointment.endAt = endAt;
    return this.appointments.save(appointment);
  }
}
