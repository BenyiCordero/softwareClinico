import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Sex } from '../enum/sex.enum';

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  personId: number;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', nullable: true })
  middleName: string | null;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'second_last_name', type: 'varchar', nullable: true })
  secondLastName: string | null;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string;

  @Column({ name: 'sex', type: 'enum', enum: Sex })
  sex: Sex;

  @Column({ name: 'curp', type: 'varchar', nullable: true })
  curp: string | null;

  @Column({ name: 'rfc', type: 'varchar', nullable: true })
  rfc: string | null;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'secondary_phone', type: 'varchar', nullable: true })
  secondaryPhone: string | null;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string | null;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city: string | null;

  @Column({ name: 'state', type: 'varchar', nullable: true })
  state: string | null;

  @Column({ name: 'postal_code', type: 'varchar', nullable: true })
  postalCode: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
