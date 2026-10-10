import { OffsetPaginationDto } from '../dto/offset-pagination.dto';

export interface OffsetPaginatedResult<T> {
  data: T[];
  pagination: OffsetPaginationDto;
}
