import { PaginationEnum } from "../enum/pagination.enum";

export class CursorPaginationDto {
  type!: PaginationEnum.CURSOR;

  limit!: number;

  hasNextPage!: boolean;

  nextCursor!: string | null;

  currentCursor!: string | null;
}