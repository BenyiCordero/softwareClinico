import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { UpdatePersonDto } from '../../../module-person/dto/request/update-person.dto';
import { BloodType } from '../../enum/blood-type.enum';
import { PatientStatus } from '../../enum/patient-status.enum';

export class UpdatePatientDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientCategoryId?: number;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType | null;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  allergiesSummary?: string | null;

  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;
}
