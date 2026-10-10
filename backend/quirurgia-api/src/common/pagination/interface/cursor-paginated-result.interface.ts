import { CursorPaginationDto } from '../dto/cursor-pagination.dto';

export interface CursorPaginatedResult<T> {
  data: T[];
  pagination: CursorPaginationDto;
}
