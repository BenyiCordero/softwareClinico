import { PaginationDto } from '../type/pagination.type';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  pagination?: PaginationDto;
}
