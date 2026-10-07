import { Sex } from '../../enum/sex.enum';

export class PersonResponseDto {
  personId: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  birthDate: string;
  sex: Sex;
  curp: string | null;
  rfc: string | null;
  phone: string;
  secondaryPhone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}
