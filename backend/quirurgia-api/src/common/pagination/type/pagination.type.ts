import { CursorPaginationDto } from "../dto/cursor-pagination.dto";
import { OffsetPaginationDto } from "../dto/offset-pagination.dto";

export type PaginationDto =
  | CursorPaginationDto
  | OffsetPaginationDto;