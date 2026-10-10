import { PaginationEnum } from '../enum/pagination.enum';

export class OffsetPaginationDto {
  type!: PaginationEnum.OFFSET;

  page!: number;

  limit!: number;

  totalItems!: number;

  totalPages!: number;

  hasNextPage!: boolean;

  hasPreviousPage!: boolean;
}
