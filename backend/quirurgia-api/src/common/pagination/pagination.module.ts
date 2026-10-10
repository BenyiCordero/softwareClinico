import { Module } from '@nestjs/common';
import { CursorCodecService } from './cursor-codec.service';

@Module({
  providers: [CursorCodecService],
  exports: [CursorCodecService],
})
export class PaginationModule {}
