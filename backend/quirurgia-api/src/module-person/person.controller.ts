import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePersonDto } from './dto/request/create-person.dto';
import { FindPersonQueryDto } from './dto/request/find-person-query.dto';
import { UpdatePersonDto } from './dto/request/update-person.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';
import { PersonService } from './person.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('people')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @RequirePermissions('people.read')
  @Get()
  findAll(
    @Query() query?: FindPersonQueryDto,
  ): Promise<OffsetPaginatedResult<PersonResponseDto>> {
    return this.personService.findAll(query);
  }

  @RequirePermissions('people.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PersonResponseDto> {
    return this.personService.findOne(id);
  }

  @RequirePermissions('people.create')
  @Post()
  create(@Body() dto: CreatePersonDto): Promise<PersonResponseDto> {
    return this.personService.create(dto);
  }

  @RequirePermissions('people.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personService.update(id, dto);
  }

  @RequirePermissions('people.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.personService.remove(id);
  }
}
