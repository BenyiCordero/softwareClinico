import { Person } from '../entity/person.entity';
import { PersonResponseDto } from './response/person-response.dto';

export class PersonMapper {
  static toResponseDto(person: Person): PersonResponseDto {
    return {
      personId: person.personId,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      secondLastName: person.secondLastName,
      birthDate: person.birthDate,
      sex: person.sex,
      curp: person.curp,
      rfc: person.rfc,
      phone: person.phone,
      secondaryPhone: person.secondaryPhone,
      email: person.email,
      address: person.address,
      city: person.city,
      state: person.state,
      postalCode: person.postalCode,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }
}
