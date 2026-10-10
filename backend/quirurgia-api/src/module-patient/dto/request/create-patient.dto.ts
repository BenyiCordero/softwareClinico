import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { CreatePersonDto } from '../../../module-person/dto/request/create-person.dto';
import { BloodType } from '../../enum/blood-type.enum';

export class CreatePatientDto {
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @Type(() => Number)
  @IsInt()
  patientCategoryId: number;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType | null;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  allergiesSummary?: string | null;
}
