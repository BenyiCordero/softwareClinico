# Modelo de Base de Datos — API Clínica

## Convenciones generales

* Todas las entidades utilizan identificadores `id`.
* Los estados se representan mediante **ENUMs**, evitando campos booleanos como `is_active`, `is_primary`, `is_mandatory`, etc.
* Los registros que puedan habilitarse/deshabilitarse utilizan un campo `status`.
* Los ENUMs mostrados representan los estados iniciales del sistema y pueden ampliarse conforme evolucione el dominio.
* Las fechas de eventos se almacenan independientemente del `status`. Por ejemplo, una cita puede tener `status = CANCELLED` y además `cancelled_at`.
* `created_at` y `updated_at` representan auditoría temporal básica. Las operaciones relevantes también se registran en `audit_logs`.
* Los permisos de un usuario se obtienen de sus roles y posteriormente se aplican sus permisos particulares (`ALLOW` / `DENY`).

---

# 1. Autenticación y seguridad

## `users`

Cuenta utilizada para autenticarse en el sistema.

### Atributos

* `id`
* `person_id` nullable
* `username`
* `email`
* `password_hash`
* `status` → `UserStatus`
* `email_verified_at` nullable
* `last_login_at` nullable
* `created_at`
* `updated_at`
* `deleted_at` nullable

### ENUM `UserStatus`

* `PENDING`
* `ACTIVE`
* `SUSPENDED`
* `BLOCKED`
* `DISABLED`

### Relaciones

* `person_id → persons.id`
* N:M con `roles` mediante `user_roles`
* 1:N con `user_permission_overrides`
* 1:N con `sessions`
* 1:N con `audit_logs`

---

## `roles`

Roles dinámicos del sistema.

Ejemplos: Administrador, Recepción, Médico, Enfermería.

### Atributos

* `id`
* `name`
* `description`
* `type` → `RoleType`
* `status` → `RoleStatus`
* `created_at`
* `updated_at`

### ENUM `RoleType`

* `SYSTEM`
* `CUSTOM`

### ENUM `RoleStatus`

* `ACTIVE`
* `DISABLED`

### Relaciones

* N:M con `users`
* N:M con `permissions`

---

## `permissions`

Permisos atómicos disponibles dentro del sistema.

### Atributos

* `id`
* `code`
* `module`
* `resource`
* `action`
* `description`
* `status` → `PermissionStatus`
* `created_at`

### ENUM `PermissionStatus`

* `ACTIVE`
* `DEPRECATED`
* `DISABLED`

### Ejemplos conceptuales

* `appointments.create`
* `appointments.cancel`
* `clinical_records.read`
* `clinical_records.write`
* `payments.register`

---

## `role_permissions`

Asocia los permisos disponibles con un rol.

### Atributos

* `id`
* `role_id`
* `permission_id`
* `created_at`

### Relaciones

* `role_id → roles.id`
* `permission_id → permissions.id`

### Restricciones

* UNIQUE (`role_id`, `permission_id`)

---

## `user_roles`

Asigna uno o varios roles a un usuario.

### Atributos

* `id`
* `user_id`
* `role_id`
* `branch_id` nullable
* `status` → `UserRoleStatus`
* `valid_from` nullable
* `valid_until` nullable
* `created_at`

### ENUM `UserRoleStatus`

* `ACTIVE`
* `SUSPENDED`
* `EXPIRED`
* `REVOKED`

### Relaciones

* `user_id → users.id`
* `role_id → roles.id`
* `branch_id → branches.id`

`branch_id` permite limitar un rol a una sucursal específica.

---

## `user_permission_overrides`

Permisos particulares asignados directamente a un usuario.

Permite modificar los permisos heredados de sus roles sin necesidad de crear un rol específico para cada usuario.

### Atributos

* `id`
* `user_id`
* `permission_id`
* `effect` → `PermissionEffect`
* `branch_id` nullable
* `status` → `PermissionOverrideStatus`
* `reason` nullable
* `valid_from` nullable
* `valid_until` nullable
* `created_by`
* `created_at`

### ENUM `PermissionEffect`

* `ALLOW`
* `DENY`

### ENUM `PermissionOverrideStatus`

* `ACTIVE`
* `EXPIRED`
* `REVOKED`

### Relaciones

* `user_id → users.id`
* `permission_id → permissions.id`
* `branch_id → branches.id`
* `created_by → users.id`

### Resolución conceptual

```text
Permisos efectivos =
    permisos heredados de roles
    + ALLOW particulares
    - DENY particulares
```

---

## `sessions`

Sesiones de autenticación.

### Atributos

* `id`
* `user_id`
* `refresh_token_hash`
* `status` → `SessionStatus`
* `expires_at`
* `revoked_at` nullable
* `ip_address`
* `user_agent`
* `created_at`

### ENUM `SessionStatus`

* `ACTIVE`
* `EXPIRED`
* `REVOKED`

### Relaciones

* `user_id → users.id`

---

## `audit_logs`

Registro de operaciones relevantes realizadas dentro del sistema.

### Atributos

* `id`
* `user_id` nullable
* `action`
* `module`
* `entity_type`
* `entity_id` nullable
* `old_values` nullable
* `new_values` nullable
* `ip_address`
* `user_agent`
* `occurred_at`

### Relaciones

* `user_id → users.id`

---

# 2. Organización

## `branches`

Sucursales de la clínica.

### Atributos

* `id`
* `code`
* `name`
* `phone`
* `email`
* `address`
* `city`
* `state`
* `postal_code`
* `timezone`
* `status` → `BranchStatus`
* `created_at`
* `updated_at`

### ENUM `BranchStatus`

* `ACTIVE`
* `TEMPORARILY_CLOSED`
* `INACTIVE`

---

## `areas`

Áreas existentes dentro de una sucursal.

Ejemplos: Recepción, Odontología, Laboratorio.

### Atributos

* `id`
* `branch_id`
* `parent_area_id` nullable
* `name`
* `description`
* `status` → `AreaStatus`
* `created_at`
* `updated_at`

### ENUM `AreaStatus`

* `ACTIVE`
* `INACTIVE`

### Relaciones

* `branch_id → branches.id`
* `parent_area_id → areas.id`

`parent_area_id` permite representar áreas jerárquicas.

---

## `consulting_rooms`

Consultorios físicos.

### Atributos

* `id`
* `branch_id`
* `area_id` nullable
* `code`
* `name`
* `floor` nullable
* `description`
* `status` → `ConsultingRoomStatus`
* `created_at`
* `updated_at`

### ENUM `ConsultingRoomStatus`

* `AVAILABLE`
* `MAINTENANCE`
* `TEMPORARILY_UNAVAILABLE`
* `INACTIVE`

### Relaciones

* `branch_id → branches.id`
* `area_id → areas.id`

---

## `positions`

Puestos laborales.

Ejemplos: Médico general, Recepcionista, Enfermero, Administrador.

### Atributos

* `id`
* `name`
* `description`
* `status` → `PositionStatus`
* `created_at`
* `updated_at`

### ENUM `PositionStatus`

* `ACTIVE`
* `INACTIVE`

---

# 3. Personas

## `persons`

Entidad base para representar personas.

Una misma persona puede posteriormente actuar como paciente, empleado, profesional de salud y/o usuario.

### Atributos

* `id`
* `first_name`
* `middle_name` nullable
* `last_name`
* `second_last_name` nullable
* `birth_date`
* `sex` → `Sex`
* `curp` nullable
* `rfc` nullable
* `phone`
* `secondary_phone` nullable
* `email` nullable
* `address` nullable
* `city` nullable
* `state` nullable
* `postal_code` nullable
* `created_at`
* `updated_at`
* `deleted_at` nullable

### ENUM `Sex`

* `MALE`
* `FEMALE`
* `UNSPECIFIED`

---

## `patients`

Información específica de una persona registrada como paciente.

### Atributos

* `id`
* `person_id`
* `patient_number`
* `patient_category_id`
* `blood_type` nullable → `BloodType`
* `allergies_summary` nullable
* `status` → `PatientStatus`
* `registered_at`
* `created_at`
* `updated_at`

### ENUM `PatientStatus`

* `ACTIVE`
* `INACTIVE`
* `DECEASED`
* `BLOCKED`

### ENUM `BloodType`

* `A_POSITIVE`
* `A_NEGATIVE`
* `B_POSITIVE`
* `B_NEGATIVE`
* `AB_POSITIVE`
* `AB_NEGATIVE`
* `O_POSITIVE`
* `O_NEGATIVE`
* `UNKNOWN`

### Relaciones

* `person_id → persons.id`
* `patient_category_id → patient_categories.id`
* 1:1 con `clinical_records`
* 1:N con `appointments`
* 1:N con `emergency_contacts`
* 1:N con `patient_special_prices`

---

## `employees`

Información laboral de una persona.

### Atributos

* `id`
* `person_id`
* `employee_number`
* `hire_date`
* `termination_date` nullable
* `status` → `EmployeeStatus`
* `created_at`
* `updated_at`

### ENUM `EmployeeStatus`

* `ACTIVE`
* `ON_LEAVE`
* `SUSPENDED`
* `TERMINATED`

### Relaciones

* `person_id → persons.id`
* N:M con sucursales, áreas y puestos mediante `employee_assignments`

---

## `employee_assignments`

Asignación organizacional de un empleado.

### Atributos

* `id`
* `employee_id`
* `branch_id`
* `area_id` nullable
* `position_id`
* `assignment_type` → `AssignmentType`
* `status` → `EmployeeAssignmentStatus`
* `start_date`
* `end_date` nullable

### ENUM `AssignmentType`

* `PRIMARY`
* `SECONDARY`

### ENUM `EmployeeAssignmentStatus`

* `ACTIVE`
* `SUSPENDED`
* `ENDED`

### Relaciones

* `employee_id → employees.id`
* `branch_id → branches.id`
* `area_id → areas.id`
* `position_id → positions.id`

---

## `health_professionals`

Extensión de un empleado que puede proporcionar atención clínica.

### Atributos

* `id`
* `employee_id`
* `professional_license`
* `specialty_license` nullable
* `bio` nullable
* `status` → `HealthProfessionalStatus`
* `created_at`
* `updated_at`

### ENUM `HealthProfessionalStatus`

* `ACTIVE`
* `SUSPENDED`
* `INACTIVE`

### Relaciones

* `employee_id → employees.id`
* N:M con `specialties`
* N:M con servicios
* 1:N con agendas
* 1:N con consultas clínicas

---

## `specialties`

Especialidades médicas.

### Atributos

* `id`
* `name`
* `description`
* `status` → `SpecialtyStatus`

### ENUM `SpecialtyStatus`

* `ACTIVE`
* `INACTIVE`

---

## `professional_specialties`

Asociación entre profesionales y especialidades.

### Atributos

* `id`
* `health_professional_id`
* `specialty_id`
* `priority` → `SpecialtyPriority`

### ENUM `SpecialtyPriority`

* `PRIMARY`
* `SECONDARY`

### Relaciones

* `health_professional_id → health_professionals.id`
* `specialty_id → specialties.id`

---

## `emergency_contacts`

Contactos de emergencia de un paciente.

### Atributos

* `id`
* `patient_id`
* `name`
* `relationship`
* `phone`
* `secondary_phone` nullable
* `email` nullable
* `priority` → `ContactPriority`
* `status` → `EmergencyContactStatus`
* `created_at`
* `updated_at`

### ENUM `ContactPriority`

* `PRIMARY`
* `SECONDARY`

### ENUM `EmergencyContactStatus`

* `ACTIVE`
* `INACTIVE`

### Relaciones

* `patient_id → patients.id`

---

# 4. Servicios

## `service_categories`

Categorías de servicios.

### Atributos

* `id`
* `parent_category_id` nullable
* `name`
* `description`
* `status` → `ServiceCategoryStatus`
* `created_at`
* `updated_at`

### ENUM `ServiceCategoryStatus`

* `ACTIVE`
* `INACTIVE`

### Relaciones

* `parent_category_id → service_categories.id`

---

## `services`

Servicios ofrecidos por la clínica.

### Atributos

* `id`
* `category_id`
* `code`
* `name`
* `description`
* `duration_minutes`
* `scheduling_type` → `SchedulingType`
* `status` → `ServiceStatus`
* `created_at`
* `updated_at`

### ENUM `SchedulingType`

* `APPOINTMENT_REQUIRED`
* `WALK_IN_ALLOWED`
* `NO_APPOINTMENT`

### ENUM `ServiceStatus`

* `ACTIVE`
* `TEMPORARILY_UNAVAILABLE`
* `DISCONTINUED`

### Relaciones

* `category_id → service_categories.id`
* N:M con profesionales
* N:M con sucursales
* 1:N con requisitos
* 1:N con precios

---

## `service_requirements`

Requisitos necesarios para recibir un servicio.

### Atributos

* `id`
* `service_id`
* `name`
* `description`
* `requirement_level` → `RequirementLevel`
* `sort_order`
* `status` → `ServiceRequirementStatus`

### ENUM `RequirementLevel`

* `REQUIRED`
* `OPTIONAL`

### ENUM `ServiceRequirementStatus`

* `ACTIVE`
* `INACTIVE`

### Relaciones

* `service_id → services.id`

---

## `service_assignments`

Determina dónde y por quién puede proporcionarse un servicio.

### Atributos

* `id`
* `service_id`
* `branch_id`
* `area_id` nullable
* `consulting_room_id` nullable
* `health_professional_id` nullable
* `status` → `ServiceAssignmentStatus`
* `created_at`

### ENUM `ServiceAssignmentStatus`

* `ACTIVE`
* `SUSPENDED`
* `INACTIVE`

### Relaciones

* `service_id → services.id`
* `branch_id → branches.id`
* `area_id → areas.id`
* `consulting_room_id → consulting_rooms.id`
* `health_professional_id → health_professionals.id`

---

# 5. Precios

## `patient_categories`

Categorías comerciales de pacientes.

Ejemplos: público general, empleado, convenio, aseguradora.

### Atributos

* `id`
* `name`
* `description`
* `status` → `PatientCategoryStatus`
* `created_at`
* `updated_at`

### ENUM `PatientCategoryStatus`

* `ACTIVE`
* `INACTIVE`

---

## `price_lists`

Listas de precios.

### Atributos

* `id`
* `name`
* `description`
* `branch_id` nullable
* `patient_category_id` nullable
* `currency`
* `valid_from`
* `valid_until` nullable
* `priority`
* `status` → `PriceListStatus`
* `created_at`
* `updated_at`

### ENUM `PriceListStatus`

* `DRAFT`
* `SCHEDULED`
* `ACTIVE`
* `EXPIRED`
* `CANCELLED`

### Relaciones

* `branch_id → branches.id`
* `patient_category_id → patient_categories.id`

---

## `price_list_details`

Precio de un servicio dentro de una lista.

### Atributos

* `id`
* `price_list_id`
* `service_id`
* `price`
* `status` → `PriceDetailStatus`
* `created_at`
* `updated_at`

### ENUM `PriceDetailStatus`

* `ACTIVE`
* `INACTIVE`

### Relaciones

* `price_list_id → price_lists.id`
* `service_id → services.id`

### Restricciones

* UNIQUE (`price_list_id`, `service_id`)

---

## `patient_special_prices`

Precio especial de un servicio para un paciente específico.

### Atributos

* `id`
* `patient_id`
* `service_id`
* `branch_id` nullable
* `price`
* `valid_from`
* `valid_until` nullable
* `reason` nullable
* `authorized_by`
* `status` → `SpecialPriceStatus`
* `created_at`
* `updated_at`

### ENUM `SpecialPriceStatus`

* `SCHEDULED`
* `ACTIVE`
* `EXPIRED`
* `REVOKED`

### Relaciones

* `patient_id → patients.id`
* `service_id → services.id`
* `branch_id → branches.id`
* `authorized_by → users.id`

---

# 6. Agenda

## `schedules`

Agenda perteneciente a un profesional.

### Atributos

* `id`
* `health_professional_id`
* `branch_id`
* `consulting_room_id` nullable
* `name`
* `slot_duration_minutes`
* `status` → `ScheduleStatus`
* `created_at`
* `updated_at`

### ENUM `ScheduleStatus`

* `ACTIVE`
* `SUSPENDED`
* `INACTIVE`

### Relaciones

* `health_professional_id → health_professionals.id`
* `branch_id → branches.id`
* `consulting_room_id → consulting_rooms.id`

---

## `schedule_hours`

Horarios recurrentes de una agenda.

### Atributos

* `id`
* `schedule_id`
* `day_of_week` → `DayOfWeek`
* `start_time`
* `end_time`
* `valid_from`
* `valid_until` nullable
* `status` → `ScheduleHourStatus`

### ENUM `DayOfWeek`

* `MONDAY`
* `TUESDAY`
* `WEDNESDAY`
* `THURSDAY`
* `FRIDAY`
* `SATURDAY`
* `SUNDAY`

### ENUM `ScheduleHourStatus`

* `ACTIVE`
* `SUSPENDED`
* `INACTIVE`

### Relaciones

* `schedule_id → schedules.id`

---

## `schedule_blocks`

Bloqueos o excepciones a la disponibilidad.

### Atributos

* `id`
* `schedule_id`
* `start_at`
* `end_at`
* `reason`
* `block_type` → `ScheduleBlockType`
* `status` → `ScheduleBlockStatus`
* `created_by`
* `created_at`

### ENUM `ScheduleBlockType`

* `VACATION`
* `BREAK`
* `MEETING`
* `MEDICAL_LEAVE`
* `PERSONAL`
* `MAINTENANCE`
* `OTHER`

### ENUM `ScheduleBlockStatus`

* `ACTIVE`
* `CANCELLED`
* `COMPLETED`

### Relaciones

* `schedule_id → schedules.id`
* `created_by → users.id`

---

## `appointments`

Citas de pacientes.

### Atributos

* `id`
* `patient_id`
* `schedule_id`
* `health_professional_id`
* `service_id`
* `branch_id`
* `consulting_room_id` nullable
* `start_at`
* `end_at`
* `status` → `AppointmentStatus`
* `reason_for_visit` nullable
* `notes` nullable
* `price_at_booking` nullable
* `created_by`
* `confirmed_at` nullable
* `cancelled_at` nullable
* `checked_in_at` nullable
* `started_at` nullable
* `finished_at` nullable
* `created_at`
* `updated_at`

### ENUM `AppointmentStatus`

* `SCHEDULED`
* `CONFIRMED`
* `CHECKED_IN`
* `IN_PROGRESS`
* `COMPLETED`
* `CANCELLED`
* `NO_SHOW`

### Relaciones

* `patient_id → patients.id`
* `schedule_id → schedules.id`
* `health_professional_id → health_professionals.id`
* `service_id → services.id`
* `branch_id → branches.id`
* `consulting_room_id → consulting_rooms.id`
* `created_by → users.id`

### Flujo principal

```text
SCHEDULED
    ↓
CONFIRMED
    ↓
CHECKED_IN
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Salidas alternativas:

```text
SCHEDULED / CONFIRMED
        ├── CANCELLED
        └── NO_SHOW
```

---

## `appointment_reschedules`

Historial de reprogramaciones.

### Atributos

* `id`
* `appointment_id`
* `previous_start_at`
* `previous_end_at`
* `new_start_at`
* `new_end_at`
* `reason`
* `changed_by`
* `created_at`

### Relaciones

* `appointment_id → appointments.id`
* `changed_by → users.id`

---

# 7. Expediente clínico

## `clinical_records`

Expediente clínico principal de un paciente.

### Atributos

* `id`
* `patient_id`
* `record_number`
* `opened_at`
* `status` → `ClinicalRecordStatus`
* `created_at`
* `updated_at`

### ENUM `ClinicalRecordStatus`

* `OPEN`
* `RESTRICTED`
* `ARCHIVED`
* `CLOSED`

### Relaciones

* `patient_id → patients.id`

### Cardinalidad

```text
patients 1 ─── 1 clinical_records
```

---

## `medical_histories`

Historia clínica general.

### Atributos

* `id`
* `clinical_record_id`
* `family_history` nullable
* `personal_pathological_history` nullable
* `personal_non_pathological_history` nullable
* `surgical_history` nullable
* `allergies` nullable
* `current_medications` nullable
* `gynecological_history` nullable
* `notes` nullable
* `updated_by`
* `created_at`
* `updated_at`

### Relaciones

* `clinical_record_id → clinical_records.id`
* `updated_by → users.id`

---

## `consultations`

Evento de atención clínica.

### Atributos

* `id`
* `clinical_record_id`
* `appointment_id` nullable
* `health_professional_id`
* `branch_id`
* `consulting_room_id` nullable
* `service_id` nullable
* `reason`
* `clinical_summary` nullable
* `status` → `ConsultationStatus`
* `started_at`
* `finished_at` nullable
* `created_at`
* `updated_at`

### ENUM `ConsultationStatus`

* `OPEN`
* `IN_PROGRESS`
* `COMPLETED`
* `CANCELLED`
* `AMENDED`

### Relaciones

* `clinical_record_id → clinical_records.id`
* `appointment_id → appointments.id`
* `health_professional_id → health_professionals.id`
* `branch_id → branches.id`
* `consulting_room_id → consulting_rooms.id`
* `service_id → services.id`

---

## `diagnoses`

Diagnósticos asociados a una consulta.

### Atributos

* `id`
* `consultation_id`
* `code` nullable
* `description`
* `diagnosis_type` → `DiagnosisType`
* `priority` → `DiagnosisPriority`
* `notes` nullable
* `created_at`

### ENUM `DiagnosisType`

* `PRESUMPTIVE`
* `CONFIRMED`
* `DIFFERENTIAL`
* `FOLLOW_UP`

### ENUM `DiagnosisPriority`

* `PRIMARY`
* `SECONDARY`

### Relaciones

* `consultation_id → consultations.id`

---

## `treatments`

Tratamientos prescritos.

### Atributos

* `id`
* `consultation_id`
* `name`
* `description`
* `instructions`
* `start_date` nullable
* `end_date` nullable
* `status` → `TreatmentStatus`
* `created_at`
* `updated_at`

### ENUM `TreatmentStatus`

* `PLANNED`
* `ACTIVE`
* `COMPLETED`
* `SUSPENDED`
* `CANCELLED`

### Relaciones

* `consultation_id → consultations.id`

---

## `prescriptions`

Recetas médicas.

### Atributos

* `id`
* `consultation_id`
* `health_professional_id`
* `issued_at`
* `notes` nullable
* `status` → `PrescriptionStatus`

### ENUM `PrescriptionStatus`

* `ACTIVE`
* `COMPLETED`
* `CANCELLED`
* `EXPIRED`

### Relaciones

* `consultation_id → consultations.id`
* `health_professional_id → health_professionals.id`

---

## `prescription_items`

Medicamentos contenidos en una receta.

### Atributos

* `id`
* `prescription_id`
* `medication`
* `presentation` nullable
* `dose`
* `route` nullable
* `frequency`
* `duration`
* `instructions` nullable

### Relaciones

* `prescription_id → prescriptions.id`

---

## `clinical_notes`

Notas generadas durante una consulta.

### Atributos

* `id`
* `consultation_id`
* `health_professional_id`
* `note_type` → `ClinicalNoteType`
* `content`
* `status` → `ClinicalNoteStatus`
* `created_at`
* `updated_at`

### ENUM `ClinicalNoteType`

* `EVOLUTION`
* `INITIAL`
* `FOLLOW_UP`
* `PROCEDURE`
* `DISCHARGE`
* `OTHER`

### ENUM `ClinicalNoteStatus`

* `DRAFT`
* `SIGNED`
* `AMENDED`
* `VOIDED`

### Relaciones

* `consultation_id → consultations.id`
* `health_professional_id → health_professionals.id`

---

## `clinical_documents`

Documentos asociados al expediente.

### Atributos

* `id`
* `clinical_record_id`
* `consultation_id` nullable
* `document_type`
* `file_name`
* `storage_key`
* `mime_type`
* `file_size`
* `description` nullable
* `status` → `ClinicalDocumentStatus`
* `uploaded_by`
* `created_at`

### ENUM `ClinicalDocumentStatus`

* `ACTIVE`
* `ARCHIVED`
* `VOIDED`

### Relaciones

* `clinical_record_id → clinical_records.id`
* `consultation_id → consultations.id`
* `uploaded_by → users.id`

---

# 8. Facturación y cobros

## `orders`

Cuenta u orden de cobro de un paciente.

### Atributos

* `id`
* `folio`
* `patient_id`
* `appointment_id` nullable
* `consultation_id` nullable
* `branch_id`
* `status` → `OrderStatus`
* `subtotal`
* `discount`
* `tax`
* `total`
* `balance`
* `created_by`
* `created_at`
* `updated_at`

### ENUM `OrderStatus`

* `DRAFT`
* `PENDING_PAYMENT`
* `PARTIALLY_PAID`
* `PAID`
* `CANCELLED`
* `REFUNDED`

### Relaciones

* `patient_id → patients.id`
* `appointment_id → appointments.id`
* `consultation_id → consultations.id`
* `branch_id → branches.id`
* `created_by → users.id`

---

## `order_details`

Servicios incluidos en una orden.

### Atributos

* `id`
* `order_id`
* `service_id`
* `description`
* `quantity`
* `unit_price`
* `discount`
* `tax`
* `total`
* `status` → `OrderDetailStatus`

### ENUM `OrderDetailStatus`

* `PENDING`
* `PROVIDED`
* `CANCELLED`
* `REFUNDED`

### Relaciones

* `order_id → orders.id`
* `service_id → services.id`

> `unit_price` conserva el precio histórico realmente utilizado en la operación. Una modificación posterior de la lista de precios no altera órdenes anteriores.

---

## `payment_methods`

Métodos de pago disponibles.

### Atributos

* `id`
* `name`
* `code`
* `status` → `PaymentMethodStatus`
* `created_at`
* `updated_at`

### ENUM `PaymentMethodStatus`

* `ACTIVE`
* `INACTIVE`

---

## `payments`

Pagos realizados sobre una orden.

### Atributos

* `id`
* `order_id`
* `payment_method_id`
* `amount`
* `reference` nullable
* `status` → `PaymentStatus`
* `paid_at`
* `registered_by`
* `notes` nullable
* `created_at`

### ENUM `PaymentStatus`

* `PENDING`
* `CONFIRMED`
* `FAILED`
* `CANCELLED`
* `REFUNDED`
* `PARTIALLY_REFUNDED`

### Relaciones

* `order_id → orders.id`
* `payment_method_id → payment_methods.id`
* `registered_by → users.id`

Una orden puede recibir múltiples pagos.

---

# 9. Indicadores

Los indicadores no necesitan inicialmente tablas independientes.

Se calculan a partir de:

* `patients`
* `appointments`
* `services`
* `orders`
* `order_details`
* `payments`
* `health_professionals`
* `consultations`

Esto permite generar indicadores de:

* Pacientes
* Citas
* Servicios
* Ingresos
* Profesionales
* Dashboard general

Si posteriormente el volumen de información requiere precálculo, puede utilizarse una tabla de snapshots.

---

## `metric_snapshots`

Datos agregados y precalculados para indicadores.

### Atributos

* `id`
* `branch_id` nullable
* `metric_code`
* `dimension`
* `dimension_id` nullable
* `period_type` → `MetricPeriodType`
* `period_start`
* `period_end`
* `value`
* `metadata` nullable
* `generated_at`

### ENUM `MetricPeriodType`

* `DAILY`
* `WEEKLY`
* `MONTHLY`
* `QUARTERLY`
* `YEARLY`

### Relaciones

* `branch_id → branches.id`

> `metric_snapshots` es una optimización para consultas y dashboards. No constituye la fuente de verdad de los datos.

---

# Relaciones principales

```text
PERSON
 │
 ├── USER
 │    │
 │    ├── USER_ROLE ─────── ROLE
 │    │                       │
 │    │                       └── ROLE_PERMISSION ─── PERMISSION
 │    │
 │    ├── USER_PERMISSION_OVERRIDE ───────────────── PERMISSION
 │    │
 │    └── SESSION
 │
 ├── PATIENT
 │    │
 │    ├── PATIENT_CATEGORY
 │    ├── EMERGENCY_CONTACT
 │    ├── PATIENT_SPECIAL_PRICE ─── SERVICE
 │    ├── APPOINTMENT
 │    │
 │    └── CLINICAL_RECORD
 │         │
 │         ├── MEDICAL_HISTORY
 │         ├── CLINICAL_DOCUMENT
 │         │
 │         └── CONSULTATION
 │              │
 │              ├── DIAGNOSIS
 │              ├── TREATMENT
 │              ├── CLINICAL_NOTE
 │              │
 │              └── PRESCRIPTION
 │                   │
 │                   └── PRESCRIPTION_ITEM
 │
 └── EMPLOYEE
      │
      ├── EMPLOYEE_ASSIGNMENT
      │    ├── BRANCH
      │    ├── AREA
      │    └── POSITION
      │
      └── HEALTH_PROFESSIONAL
           │
           ├── PROFESSIONAL_SPECIALTY ─── SPECIALTY
           │
           └── SCHEDULE
                │
                ├── SCHEDULE_HOUR
                ├── SCHEDULE_BLOCK
                │
                └── APPOINTMENT

BRANCH
 │
 ├── AREA
 │    └── CONSULTING_ROOM
 │
 ├── EMPLOYEE_ASSIGNMENT
 ├── SCHEDULE
 ├── SERVICE_ASSIGNMENT
 ├── PRICE_LIST
 └── ORDER

SERVICE_CATEGORY
 │
 └── SERVICE
      │
      ├── SERVICE_REQUIREMENT
      ├── SERVICE_ASSIGNMENT
      ├── PRICE_LIST_DETAIL
      ├── PATIENT_SPECIAL_PRICE
      ├── APPOINTMENT
      └── ORDER_DETAIL

PATIENT_CATEGORY
 │
 ├── PATIENT
 │
 └── PRICE_LIST
      │
      └── PRICE_LIST_DETAIL
           │
           └── SERVICE

APPOINTMENT
 │
 ├── APPOINTMENT_RESCHEDULE
 ├── CONSULTATION
 └── ORDER

ORDER
 │
 ├── ORDER_DETAIL
 │
 └── PAYMENT
      │
      └── PAYMENT_METHOD
```

---

# Decisiones principales del modelo

## Persona ≠ Usuario

`persons` representa a una persona física.

`users` representa una identidad de autenticación.

Por lo tanto:

```text
PERSON
 ├── PATIENT
 ├── EMPLOYEE
 │    └── HEALTH_PROFESSIONAL
 └── USER
```

Una persona puede existir sin tener acceso al sistema.

---

## Empleado ≠ Profesional de salud

Todo profesional de salud es un empleado, pero no todo empleado es un profesional de salud.

```text
PERSON
   ↓
EMPLOYEE
   ↓
HEALTH_PROFESSIONAL
```

---

## Puesto ≠ Rol

Los puestos representan la estructura organizacional:

```text
Recepcionista
Médico general
Enfermero
Administrador
```

Los roles representan autorización:

```text
CLINICAL_STAFF
APPOINTMENT_MANAGER
BILLING_OPERATOR
SYSTEM_ADMIN
```

No deben utilizarse los puestos laborales para determinar directamente los permisos del sistema.

---

## Roles + permisos particulares

El sistema utiliza RBAC como base:

```text
USER
 ↓
USER_ROLE
 ↓
ROLE
 ↓
ROLE_PERMISSION
 ↓
PERMISSION
```

Y permite excepciones particulares:

```text
USER
 ↓
USER_PERMISSION_OVERRIDE
 ↓
PERMISSION

effect:
 ├── ALLOW
 └── DENY
```

Por lo tanto:

```text
Permisos efectivos
=
Permisos de los roles
+
ALLOW particulares
-
DENY particulares
```

Esto permite crear roles dinámicamente y modificar los permisos de usuarios específicos sin generar roles artificiales para cada combinación.

---

## Estados en lugar de booleanos

Se evita modelar estados mediante campos como:

```text
is_active
is_disabled
is_cancelled
is_primary
is_mandatory
```

En su lugar, el estado o clasificación se representa explícitamente:

```text
status = ACTIVE | SUSPENDED | INACTIVE

priority = PRIMARY | SECONDARY

requirement_level = REQUIRED | OPTIONAL
```

Esto permite extender el comportamiento del sistema sin introducir múltiples booleanos potencialmente contradictorios.

Por ejemplo, en lugar de:

```text
is_active = true
is_suspended = true
is_deleted = false
```

se utiliza:

```text
status = SUSPENDED
```

El `status` representa el **estado actual**, mientras que campos como `cancelled_at`, `revoked_at`, `finished_at`, `valid_from` y `valid_until` conservan la información temporal del evento.
