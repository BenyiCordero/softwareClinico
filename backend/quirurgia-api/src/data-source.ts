import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './module-user/entity/user.entity';
import { Role } from './module-role/entity/role.entity';
import { Permission } from './module-permission/entity/permission.entity';
import { RolePermission } from './module-role/entity/role-permission.entity';
import { UserRole } from './module-user/entity/user-role.entity';
import { UserPermissionOverride } from './module-user/entity/user-permission-override.entity';
import { AuditLog } from './module-audit-log/entity/audit-log.entity';
import { Branch } from './module-branch/entity/branch.entity';
import { Area } from './module-area/entity/area.entity';
import { ConsultingRoom } from './module-consulting-room/entity/consulting-room.entity';
import { Position } from './module-position/entity/position.entity';
import { Person } from './module-person/entity/person.entity';
import { Patient } from './module-patient/entity/patient.entity';
import { Employee } from './module-employee/entity/employee.entity';
import { EmployeeAssignment } from './module-employee/entity/employee-assignment.entity';
import { HealthProfessional } from './module-health-professional/entity/health-professional.entity';
import { Specialty } from './module-specialty/entity/specialty.entity';
import { ProfessionalSpecialty } from './module-health-professional/entity/professional-specialty.entity';
import { EmergencyContact } from './module-patient/entity/emergency-contact.entity';
import { ServiceCategory } from './module-service-category/entity/service-category.entity';
import { Service } from './module-service/entity/service.entity';
import { ServiceRequirement } from './module-service/entity/service-requirement.entity';
import { ServiceAssignment } from './module-service/entity/service-assignment.entity';
import { PatientCategory } from './module-patient-category/entity/patient-category.entity';
import { PriceList } from './module-price-list/entity/price-list.entity';
import { PriceListDetail } from './module-price-list/entity/price-list-detail.entity';
import { PatientSpecialPrice } from './module-patient-special-price/entity/patient-special-price.entity';
import { Schedule } from './module-schedule/entity/schedule.entity';
import { ScheduleHour } from './module-schedule/entity/schedule-hour.entity';
import { ScheduleBlock } from './module-schedule/entity/schedule-block.entity';
import { Appointment } from './module-appointment/entity/appointment.entity';
import { AppointmentReschedule } from './module-appointment/entity/appointment-reschedule.entity';
import { ClinicalRecord } from './module-clinical-record/entity/clinical-record.entity';
import { MedicalHistory } from './module-clinical-record/entity/medical-history.entity';
import { Consultation } from './module-consultation/entity/consultation.entity';
import { Diagnosis } from './module-consultation/entity/diagnosis.entity';
import { Treatment } from './module-consultation/entity/treatment.entity';
import { Prescription } from './module-prescription/entity/prescription.entity';
import { PrescriptionItem } from './module-prescription/entity/prescription-item.entity';
import { ClinicalNote } from './module-consultation/entity/clinical-note.entity';
import { ClinicalDocument } from './module-clinical-record/entity/clinical-document.entity';
import { Order } from './module-order/entity/order.entity';
import { OrderDetail } from './module-order/entity/order-detail.entity';
import { PaymentMethod } from './module-payment-method/entity/payment-method.entity';
import { Payment } from './module-payment/entity/payment.entity';
import { AuthSession } from './module-auth/entity/session.entity';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Role,
    Permission,
    RolePermission,
    UserRole,
    UserPermissionOverride,
    AuthSession,
    AuditLog,
    Branch,
    Area,
    ConsultingRoom,
    Position,
    Person,
    Patient,
    Employee,
    EmployeeAssignment,
    HealthProfessional,
    Specialty,
    ProfessionalSpecialty,
    EmergencyContact,
    ServiceCategory,
    Service,
    ServiceRequirement,
    ServiceAssignment,
    PatientCategory,
    PriceList,
    PriceListDetail,
    PatientSpecialPrice,
    Schedule,
    ScheduleHour,
    ScheduleBlock,
    Appointment,
    AppointmentReschedule,
    ClinicalRecord,
    MedicalHistory,
    Consultation,
    Diagnosis,
    Treatment,
    Prescription,
    PrescriptionItem,
    ClinicalNote,
    ClinicalDocument,
    Order,
    OrderDetail,
    PaymentMethod,
    Payment,
  ],
  migrations: [
    'src/migrations/*.ts',
  ],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});
