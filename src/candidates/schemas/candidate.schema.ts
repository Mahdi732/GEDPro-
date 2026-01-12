import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CandidateDocument = Candidate & Document;

export enum CandidateStatus {
  NEW = "NEW",
  PRESELECTED = "PRESELECTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  IN_INTERVIEW = "IN_INTERVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

@Schema({ _id: false })
export class StatusChange {
  @Prop({ type: String, enum: CandidateStatus, required: true })
  status: CandidateStatus;

  @Prop({ type: Date, default: () => new Date() })
  changedAt: Date;

  @Prop({ type: String })
  changedBy?: string;

  @Prop({ type: String })
  note?: string;
}

export const StatusChangeSchema = SchemaFactory.createForClass(StatusChange);

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ type: String, default: () => new Types.ObjectId().toHexString() })
  _id: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: String, enum: CandidateStatus, default: CandidateStatus.NEW })
  status: CandidateStatus;

  @Prop({ type: [StatusChangeSchema], default: [] })
  history: StatusChange[];

  @Prop()
  formId?: string;

  @Prop()
  formResponseId?: string;

  @Prop({ type: Object, default: {} })
  formData?: Record<string, any>;

  @Prop()
  organizationId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const candidateSchema = SchemaFactory.createForClass(Candidate);
