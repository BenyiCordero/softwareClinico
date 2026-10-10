import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { User } from '../module-user/entity/user.entity';
import { CreateScheduleBlockDto, CreateScheduleDto, CreateScheduleHourDto, FindScheduleQueryDto, UpdateScheduleDto, UpdateScheduleHourDto } from './dto';
import { Schedule } from './entity/schedule.entity';
import { ScheduleBlock } from './entity/schedule-block.entity';
import { ScheduleHour } from './entity/schedule-hour.entity';
import { DayOfWeek } from './enum/day-of-week.enum';
import { ScheduleBlockStatus } from './enum/schedule-block-status.enum';
import { ScheduleHourStatus } from './enum/schedule-hour-status.enum';
import { ScheduleStatus } from './enum/schedule-status.enum';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private readonly schedules: Repository<Schedule>,
    @InjectRepository(ScheduleHour) private readonly hours: Repository<ScheduleHour>,
    @InjectRepository(ScheduleBlock) private readonly blocks: Repository<ScheduleBlock>,
    @InjectRepository(Branch) private readonly branches: Repository<Branch>,
    @InjectRepository(ConsultingRoom) private readonly rooms: Repository<ConsultingRoom>,
    @InjectRepository(HealthProfessional) private readonly professionals: Repository<HealthProfessional>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findAll(query: FindScheduleQueryDto = {}) {
    const qb = this.schedules.createQueryBuilder('schedule').leftJoinAndSelect('schedule.healthProfessional', 'professional').leftJoinAndSelect('schedule.branch', 'branch').leftJoinAndSelect('schedule.consultingRoom', 'room').orderBy('schedule.name', 'ASC');
    if (query.branchId) qb.andWhere('branch.branchId = :branchId', { branchId: query.branchId });
    if (query.healthProfessionalId) qb.andWhere('professional.healthProfessionalId = :healthProfessionalId', { healthProfessionalId: query.healthProfessionalId });
    if (query.status) qb.andWhere('schedule.status = :status', { status: query.status });
    return qb.getMany();
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.schedules.findOne({ where: { scheduleId: id }, relations: { healthProfessional: true, branch: true, consultingRoom: true } });
    if (!schedule) throw new NotFoundException(`Schedule with id ${id} not found`);
    return schedule;
  }

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const [branch, professional, room] = await Promise.all([this.branches.findOneBy({ branchId: dto.branchId }), this.professionals.findOneBy({ healthProfessionalId: dto.healthProfessionalId }), dto.consultingRoomId ? this.rooms.findOne({ where: { consultingRoomId: dto.consultingRoomId }, relations: { branch: true } }) : Promise.resolve(null)]);
    if (!branch) throw new NotFoundException(`Branch with id ${dto.branchId} not found`);
    if (!professional) throw new NotFoundException(`Health professional with id ${dto.healthProfessionalId} not found`);
    if (dto.consultingRoomId && !room) throw new NotFoundException(`Consulting room with id ${dto.consultingRoomId} not found`);
    if (room && room.branch.branchId !== branch.branchId) throw new BadRequestException('The consulting room must belong to the selected branch');
    return this.schedules.save(this.schedules.create({ ...dto, branch, healthProfessional: professional, consultingRoom: room, status: ScheduleStatus.ACTIVE }));
  }

  async update(id: number, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    if (dto.consultingRoomId !== undefined) schedule.consultingRoom = dto.consultingRoomId === null ? null : await this.rooms.findOneBy({ consultingRoomId: dto.consultingRoomId });
    this.schedules.merge(schedule, dto);
    return this.schedules.save(schedule);
  }

  async addHour(scheduleId: number, dto: CreateScheduleHourDto): Promise<ScheduleHour> {
    const schedule = await this.findOne(scheduleId);
    this.validateTimeRange(dto.startTime, dto.endTime);
    return this.hours.save(this.hours.create({ ...dto, schedule, validUntil: dto.validUntil ?? null, status: ScheduleHourStatus.ACTIVE }));
  }

  async listHours(scheduleId: number): Promise<ScheduleHour[]> { await this.findOne(scheduleId); return this.hours.find({ where: { schedule: { scheduleId } }, order: { dayOfWeek: 'ASC', startTime: 'ASC' } }); }

  async updateHour(scheduleId: number, hourId: number, dto: UpdateScheduleHourDto): Promise<ScheduleHour> {
    const hour = await this.hours.findOne({ where: { scheduleHourId: hourId, schedule: { scheduleId } } });
    if (!hour) throw new NotFoundException(`Schedule hour with id ${hourId} not found`);
    const start = dto.startTime ?? hour.startTime;
    const end = dto.endTime ?? hour.endTime;
    this.validateTimeRange(start, end);
    this.hours.merge(hour, dto);
    return this.hours.save(hour);
  }

  async addBlock(scheduleId: number, userId: number, dto: CreateScheduleBlockDto): Promise<ScheduleBlock> {
    const schedule = await this.findOne(scheduleId);
    const creator = await this.users.findOneBy({ userId });
    if (!creator) throw new NotFoundException(`User with id ${userId} not found`);
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);
    if (startAt >= endAt) throw new BadRequestException('The block end must be after its start');
    const conflict = await this.blocks.createQueryBuilder('block').where('block.schedule_id = :scheduleId', { scheduleId }).andWhere('block.status = :status', { status: ScheduleBlockStatus.ACTIVE }).andWhere('block.start_at < :endAt AND block.end_at > :startAt', { startAt, endAt }).getExists();
    if (conflict) throw new ConflictException('The schedule block overlaps another active block');
    return this.blocks.save(this.blocks.create({ schedule, creator, startAt, endAt, reason: dto.reason, blockType: dto.blockType, status: ScheduleBlockStatus.ACTIVE }));
  }

  async listBlocks(scheduleId: number): Promise<ScheduleBlock[]> { await this.findOne(scheduleId); return this.blocks.find({ where: { schedule: { scheduleId }, status: ScheduleBlockStatus.ACTIVE }, order: { startAt: 'ASC' } }); }

  async availability(scheduleId: number, date: string): Promise<{ startAt: string; endAt: string }[]> {
    const schedule = await this.findOne(scheduleId);
    if (schedule.status !== ScheduleStatus.ACTIVE) return [];
    const day = this.dayOfWeek(date);
    const hours = await this.hours.find({ where: { schedule: { scheduleId }, dayOfWeek: day, status: ScheduleHourStatus.ACTIVE } });
    const blocks = await this.blocks.find({ where: { schedule: { scheduleId }, status: ScheduleBlockStatus.ACTIVE } });
    const slots: { startAt: string; endAt: string }[] = [];
    for (const hour of hours) {
      if (date < hour.validFrom || (hour.validUntil && date > hour.validUntil)) continue;
      for (let minutes = this.toMinutes(hour.startTime); minutes + schedule.slotDurationMinutes <= this.toMinutes(hour.endTime); minutes += schedule.slotDurationMinutes) {
        const start = new Date(`${date}T${this.toTime(minutes)}:00Z`);
        const end = new Date(start.getTime() + schedule.slotDurationMinutes * 60000);
        if (!blocks.some((block) => block.startAt < end && block.endAt > start)) slots.push({ startAt: start.toISOString(), endAt: end.toISOString() });
      }
    }
    return slots;
  }

  private validateTimeRange(start: string, end: string): void { if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end) || this.toMinutes(start) >= this.toMinutes(end)) throw new BadRequestException('Invalid schedule time range'); }
  private toMinutes(value: string): number { const [hours, minutes] = value.split(':').map(Number); return hours * 60 + minutes; }
  private toTime(minutes: number): string { return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`; }
  private dayOfWeek(value: string): DayOfWeek { return [DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY][new Date(`${value}T00:00:00Z`).getUTCDay()]; }
}
