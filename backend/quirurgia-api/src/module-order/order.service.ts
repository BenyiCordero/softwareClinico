import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../module-patient/entity/patient.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { Appointment } from '../module-appointment/entity/appointment.entity';
import { Consultation } from '../module-consultation/entity/consultation.entity';
import { Service } from '../module-service/entity/service.entity';
import { Order } from './entity/order.entity';
import { OrderDetail } from './entity/order-detail.entity';
import {
  CreateOrderDetailDto,
  CreateOrderDto,
  UpdateOrderDetailDto,
  UpdateOrderDto,
} from './dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(OrderDetail) private details: Repository<OrderDetail>,
    @InjectRepository(Patient) private patients: Repository<Patient>,
    @InjectRepository(Branch) private branches: Repository<Branch>,
    @InjectRepository(Appointment)
    private appointments: Repository<Appointment>,
    @InjectRepository(Consultation)
    private consultations: Repository<Consultation>,
    @InjectRepository(Service) private services: Repository<Service>,
  ) {}
  findAll() {
    return this.orders.find({
      relations: {
        patient: true,
        branch: true,
        appointment: true,
        consultation: true,
      },
      order: { orderId: 'DESC' },
    });
  }
  async findOne(id: number) {
    const item = await this.orders.findOne({
      where: { orderId: id },
      relations: {
        patient: true,
        branch: true,
        appointment: true,
        consultation: true,
      },
    });
    if (!item) throw new NotFoundException(`Order with id ${id} not found`);
    return item;
  }
  async create(dto: CreateOrderDto, userId: number) {
    const [patient, branch, appointment, consultation] = await Promise.all([
      this.patients.findOneBy({ patientId: dto.patientId }),
      this.branches.findOneBy({ branchId: dto.branchId }),
      dto.appointmentId
        ? this.appointments.findOneBy({ appointmentId: dto.appointmentId })
        : null,
      dto.consultationId
        ? this.consultations.findOneBy({ consultationId: dto.consultationId })
        : null,
    ]);
    if (
      !patient ||
      !branch ||
      (dto.appointmentId && !appointment) ||
      (dto.consultationId && !consultation)
    )
      throw new NotFoundException('One or more order relations were not found');
    return this.orders.save(
      this.orders.create({
        folio: dto.folio,
        patient,
        branch,
        appointment: appointment ?? null,
        consultation: consultation ?? null,
        status: dto.status,
        subtotal: '0',
        discount: String(dto.discount),
        tax: String(dto.tax),
        total: String(dto.tax - dto.discount),
        balance: String(dto.tax - dto.discount),
        createdBy: userId,
      }),
    );
  }
  async update(id: number, dto: UpdateOrderDto) {
    const item = await this.findOne(id);
    Object.assign(item, {
      ...dto,
      discount:
        dto.discount === undefined ? item.discount : String(dto.discount),
      tax: dto.tax === undefined ? item.tax : String(dto.tax),
    });
    return this.orders.save(item);
  }
  async listDetails(id: number) {
    await this.findOne(id);
    return this.details.find({
      where: { order: { orderId: id } },
      relations: { service: true },
      order: { orderDetailId: 'DESC' },
    });
  }
  async addDetail(id: number, dto: CreateOrderDetailDto) {
    const order = await this.findOne(id);
    const service = await this.services.findOneBy({ serviceId: dto.serviceId });
    if (!service)
      throw new NotFoundException(`Service with id ${dto.serviceId} not found`);
    const total = dto.quantity * dto.unitPrice - dto.discount + dto.tax;
    const detail = await this.details.save(
      this.details.create({
        order,
        service,
        ...dto,
        unitPrice: String(dto.unitPrice),
        discount: String(dto.discount),
        tax: String(dto.tax),
        total: String(total),
      }),
    );
    await this.recalculate(id);
    return detail;
  }
  async updateDetail(id: number, detailId: number, dto: UpdateOrderDetailDto) {
    await this.findOne(id);
    const item = await this.details.findOne({
      where: { orderDetailId: detailId, order: { orderId: id } },
    });
    if (!item)
      throw new NotFoundException(`Order detail with id ${detailId} not found`);
    Object.assign(item, dto);
    item.total = String(
      (dto.quantity ?? item.quantity) * Number(item.unitPrice) -
        (dto.discount ?? Number(item.discount)) +
        (dto.tax ?? Number(item.tax)),
    );
    const saved = await this.details.save(item);
    await this.recalculate(id);
    return saved;
  }
  async removeDetail(id: number, detailId: number) {
    await this.findOne(id);
    const item = await this.details.findOne({
      where: { orderDetailId: detailId, order: { orderId: id } },
    });
    if (!item)
      throw new NotFoundException(`Order detail with id ${detailId} not found`);
    await this.details.remove(item);
    await this.recalculate(id);
  }
  private async recalculate(id: number) {
    const order = await this.findOne(id);
    const details = await this.details.find({
      where: { order: { orderId: id } },
    });
    const subtotal = details.reduce(
      (sum, detail) => sum + Number(detail.unitPrice) * detail.quantity,
      0,
    );
    const discount =
      Number(order.discount) +
      details.reduce((sum, detail) => sum + Number(detail.discount), 0);
    const tax =
      Number(order.tax) +
      details.reduce((sum, detail) => sum + Number(detail.tax), 0);
    order.subtotal = String(subtotal);
    order.total = String(subtotal - discount + tax);
    order.balance = order.total;
    await this.orders.save(order);
  }
}
