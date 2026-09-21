import { BadRequestException } from "@nestjs/common";

export class CursorOutsideRequestedRange extends BadRequestException {
  constructor() {
    super(`Cursor is outside the requested time range`);
  }
}