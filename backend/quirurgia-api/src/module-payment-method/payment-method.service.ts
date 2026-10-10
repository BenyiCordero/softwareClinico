import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePaymentMethodDto } from './dto/request/create-payment-method.dto';
import { FindPaymentMethodQueryDto } from './dto/request/find-payment-method-query.dto';
import { UpdatePaymentMethodDto } from './dto/request/update-payment-method.dto';
import { PaymentMethodMapper } from './dto/payment-method.mapper';
import { PaymentMethodResponseDto } from './dto/res/payment-method-response.dto';
import { PaymentMethod } from './entity/payment-method.entity';
import { PaymentMethodNotFoundException } from './exception/payment-method-not-found.exception';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PaymentMethodService.name);
  }

  async findAll(
    filters?: FindPaymentMethodQueryDto,
  ): Promise<OffsetPaginatedResult<PaymentMethodResponseDto>> {
    const page: number = filters?.page ?? 1;
    const limit: number = filters?.limit ?? 100;
    const offset = (page - 1) * limit;

    const query: SelectQueryBuilder<PaymentMethod> =
      this.paymentMethodRepository
        .createQueryBuilder('paymentMethod')
        .orderBy('paymentMethod.createdAt', 'ASC')
        .addOrderBy('paymentMethod.paymentMethodId', 'ASC');

    if (filters?.name) {
      query.andWhere('paymentMethod.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters?.code) {
      query.andWhere('paymentMethod.code ILIKE :code', {
        code: `%${filters.code}%`,
      });
    }
    if (filters?.status) {
      query.andWhere('paymentMethod.status = :status', {
        status: filters.status,
      });
    }

    const [entities, totalItems] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: entities.map((entity) => PaymentMethodMapper.toResponseDto(entity)),
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

  async findOne(id: number): Promise<PaymentMethodResponseDto> {
    return PaymentMethodMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethodResponseDto> {
    const existing = await this.findByCodeOrNull(dto.code);
    if (existing) {
      this.logger.debug(
        { code: dto.code },
        'Payment method creation rejected because code is already in use',
      );
      throw new ConflictException(
        `Payment method code ${dto.code} is already in use`,
      );
    }
    const saved = await this.paymentMethodRepository.save(
      this.paymentMethodRepository.create({
        name: dto.name,
        code: dto.code,
      }),
    );
    this.logger.info(
      { paymentMethodId: saved.paymentMethodId },
      'Payment method created',
    );
    return PaymentMethodMapper.toResponseDto(saved);
  }

  async update(
    id: number,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    const existing = await this.findByIdOrThrow(id);
    const hasChanges =
      (dto.name !== undefined && existing.name !== dto.name) ||
      (dto.code !== undefined && existing.code !== dto.code) ||
      (dto.status !== undefined && existing.status !== dto.status);
    if (!hasChanges) return PaymentMethodMapper.toResponseDto(existing);

    if (dto.code !== undefined && dto.code !== existing.code) {
      const duplicate = await this.findByCodeOrNull(dto.code);
      if (duplicate) {
        this.logger.debug(
          { code: dto.code },
          'Payment method update rejected because code is already in use',
        );
        throw new ConflictException(
          `Payment method code ${dto.code} is already in use`,
        );
      }
    }

    const merged = this.paymentMethodRepository.merge(existing, dto);
    const saved = await this.paymentMethodRepository.save(merged);
    this.logger.info(
      { paymentMethodId: saved.paymentMethodId },
      'Payment method updated',
    );
    return PaymentMethodMapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findByIdOrThrow(id);
    await this.paymentMethodRepository.delete({
      paymentMethodId: existing.paymentMethodId,
    });
    this.logger.info({ paymentMethodId: id }, 'Payment method removed');
  }

  async findByIdOrThrow(id: number): Promise<PaymentMethod> {
    const entity = await this.paymentMethodRepository.findOneBy({
      paymentMethodId: id,
    });
    if (!entity) {
      this.logger.debug({ paymentMethodId: id }, 'Payment method not found');
      throw new PaymentMethodNotFoundException(id);
    }
    return entity;
  }

  private findByCodeOrNull(code: string): Promise<PaymentMethod | null> {
    return this.paymentMethodRepository
      .createQueryBuilder('paymentMethod')
      .where('LOWER(paymentMethod.code) = LOWER(:code)', { code })
      .getOne();
  }
}
