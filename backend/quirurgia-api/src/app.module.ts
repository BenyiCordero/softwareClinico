import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppConfigModule } from './common/module/config.module';
import { DatabaseModule } from './common/module/database.module';
import { LoggerConfigModule } from './common/module/logger.module';
import { AuthModule } from './module-auth/auth.module';
import { UserModule } from './module-user/user.module';
import { RoleModule } from './module-role/role.module';
import { PermissionModule } from './module-permission/permission.module';
import { AuditLogModule } from './module-audit-log/audit-log.module';
import { BranchModule } from './module-branch/branch.module';
import { AreaModule } from './module-area/area.module';
import { ConsultingRoomModule } from './module-consulting-room/consulting-room.module';
import { PositionModule } from './module-position/position.module';
import { PersonModule } from './module-person/person.module';
import { PatientModule } from './module-patient/patient.module';
import { EmployeeModule } from './module-employee/employee.module';
import { HealthProfessionalModule } from './module-health-professional/health-professional.module';
import { SpecialtyModule } from './module-specialty/specialty.module';
import { ServiceCategoryModule } from './module-service-category/service-category.module';
import { ServiceModule } from './module-service/service.module';
import { PatientCategoryModule } from './module-patient-category/patient-category.module';
import { PriceListModule } from './module-price-list/price-list.module';
import { PatientSpecialPriceModule } from './module-patient-special-price/patient-special-price.module';
import { ScheduleModule } from './module-schedule/schedule.module';
import { AppointmentModule } from './module-appointment/appointment.module';
import { ClinicalRecordModule } from './module-clinical-record/clinical-record.module';
import { ConsultationModule } from './module-consultation/consultation.module';
import { PrescriptionModule } from './module-prescription/prescription.module';
import { OrderModule } from './module-order/order.module';
import { PaymentMethodModule } from './module-payment-method/payment-method.module';
import { PaymentModule } from './module-payment/payment.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    AuditLogModule,
    BranchModule,
    AreaModule,
    ConsultingRoomModule,
    PositionModule,
    PersonModule,
    PatientModule,
    EmployeeModule,
    HealthProfessionalModule,
    SpecialtyModule,
    ServiceCategoryModule,
    ServiceModule,
    PatientCategoryModule,
    PriceListModule,
    PatientSpecialPriceModule,
    ScheduleModule,
    AppointmentModule,
    ClinicalRecordModule,
    ConsultationModule,
    PrescriptionModule,
    OrderModule,
    PaymentMethodModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
