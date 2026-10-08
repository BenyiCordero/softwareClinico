import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Consultation } from '../../module-consultation/entity/consultation.entity';
import { User } from '../../module-user/entity/user.entity';
import { ClinicalDocumentStatus } from '../enum/clinical-document-status.enum';
import { ClinicalRecord } from './clinical-record.entity';

@Entity('clinical_document')
export class ClinicalDocument {
  @PrimaryGeneratedColumn()
  clinicalDocumentId: number;

  @ManyToOne(() => ClinicalRecord, { nullable: false })
  @JoinColumn({ name: 'clinical_record_id' })
  clinicalRecord: Relation<ClinicalRecord>;

  @ManyToOne(() => Consultation, { nullable: true })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation> | null;

  @Column({ name: 'document_type', type: 'varchar' })
  documentType: string;

  @Column({ name: 'file_name', type: 'varchar' })
  fileName: string;

  @Column({ name: 'storage_key', type: 'varchar' })
  storageKey: string;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'status', type: 'enum', enum: ClinicalDocumentStatus })
  status: ClinicalDocumentStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
