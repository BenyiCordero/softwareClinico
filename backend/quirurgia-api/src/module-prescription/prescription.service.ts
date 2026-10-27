import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginationQueryDto } from '../common/pagination/dto/offset-pagination-query.dto';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Consultation } from '../module-consultation/entity/consultation.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { Prescription } from './entity/prescription.entity';
import { PrescriptionItem } from './entity/prescription-item.entity';
import {
  CreatePrescriptionDto,
  CreatePrescriptionItemDto,
  UpdatePrescriptionDto,
} from './dto';
@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptions: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private items: Repository<PrescriptionItem>,
    @InjectRepository(Consultation)
    private consultations: Repository<Consultation>,
    @InjectRepository(HealthProfessional)
    private professionals: Repository<HealthProfessional>,
  ) {}
  async findAll(
    query: OffsetPaginationQueryDto = {},
  ): Promise<OffsetPaginatedResult<Prescription>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const [data, totalItems] = await this.prescriptions.findAndCount({
      relations: { consultation: true, healthProfessional: true },
      order: { prescriptionId: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data,
      pagination: {
        type: PaginationEnum.OFFSET,
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
  async findOne(id: number) {
    const item = await this.prescriptions.findOne({
      where: { prescriptionId: id },
      relations: { consultation: true, healthProfessional: true },
    });
    if (!item)
      throw new NotFoundException(`Prescription with id ${id} not found`);
    return item;
  }
  async create(dto: CreatePrescriptionDto) {
    const consultation = await this.consultations.findOneBy({
      consultationId: dto.consultationId,
    });
    const healthProfessional = await this.professionals.findOneBy({
      healthProfessionalId: dto.healthProfessionalId,
    });
    if (!consultation || !healthProfessional)
      throw new NotFoundException(
        'Consultation or health professional not found',
      );
    return this.prescriptions.save(
      this.prescriptions.create({
        consultation,
        healthProfessional,
        issuedAt: new Date(dto.issuedAt),
        notes: dto.notes ?? null,
        status: dto.status,
      }),
    );
  }
  async update(id: number, dto: UpdatePrescriptionDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.prescriptions.save(item);
  }
  async listItems(id: number) {
    await this.findOne(id);
    return this.items.find({
      where: { prescription: { prescriptionId: id } },
      order: { prescriptionItemId: 'DESC' },
    });
  }
  async addItem(id: number, dto: CreatePrescriptionItemDto) {
    const prescription = await this.findOne(id);
    return this.items.save(
      this.items.create({
        prescription,
        ...dto,
        presentation: dto.presentation ?? null,
        route: dto.route ?? null,
        instructions: dto.instructions ?? null,
      }),
    );
  }
  async removeItem(id: number, itemId: number) {
    await this.findOne(id);
    const item = await this.items.findOne({
      where: {
        prescriptionItemId: itemId,
        prescription: { prescriptionId: id },
      },
    });
    if (!item)
      throw new NotFoundException(
        `Prescription item with id ${itemId} not found`,
      );
    await this.items.remove(item);
  }
}
