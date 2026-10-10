import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../module-order/entity/order.entity';
import { PaymentMethod } from '../module-payment-method/entity/payment-method.entity';
import { User } from '../module-user/entity/user.entity';
import { Payment } from './entity/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(PaymentMethod) private methods: Repository<PaymentMethod>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}
  findAll() {
    return this.payments.find({
      relations: { order: true, paymentMethod: true, registrar: true },
      order: { paymentId: 'DESC' },
    });
  }
  async findOne(id: number) {
    const item = await this.payments.findOne({
      where: { paymentId: id },
      relations: { order: true, paymentMethod: true, registrar: true },
    });
    if (!item) throw new NotFoundException(`Payment with id ${id} not found`);
    return item;
  }
  async forOrder(orderId: number) {
    const order = await this.orders.findOneBy({ orderId });
    if (!order)
      throw new NotFoundException(`Order with id ${orderId} not found`);
    return this.payments.find({
      where: { order: { orderId } },
      relations: { paymentMethod: true, registrar: true },
      order: { paymentId: 'DESC' },
    });
  }
  async create(dto: CreatePaymentDto, userId: number) {
    const [order, paymentMethod, registrar] = await Promise.all([
      this.orders.findOneBy({ orderId: dto.orderId }),
      this.methods.findOneBy({ paymentMethodId: dto.paymentMethodId }),
      this.users.findOneBy({ userId }),
    ]);
    if (!order || !paymentMethod || !registrar)
      throw new NotFoundException('Order, payment method or user not found');
    if (dto.amount > Number(order.balance))
      throw new BadRequestException(
        'Payment amount cannot exceed the order balance',
      );
    const payment = await this.payments.save(
      this.payments.create({
        order,
        paymentMethod,
        registrar,
        amount: String(dto.amount),
        reference: dto.reference ?? null,
        status: dto.status,
        paidAt: new Date(dto.paidAt),
        notes: dto.notes ?? null,
      }),
    );
    await this.recalculate(order.orderId);
    return payment;
  }
  async update(id: number, dto: UpdatePaymentDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.payments.save(item);
  }
  private async recalculate(orderId: number) {
    const order = await this.orders.findOneBy({ orderId });
    if (!order) return;
    const payments = await this.payments.find({
      where: { order: { orderId } },
    });
    const paid = payments
      .filter((payment) => payment.status === 'CONFIRMED')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    order.balance = String(Math.max(0, Number(order.total) - paid));
    await this.orders.save(order);
  }
}
