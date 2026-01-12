import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type InterviewDocument = Interview & Document;

export enum InterviewType {
  INITIAL = "INITIAL",
  TECHNICAL = "TECHNICAL",
  HR = "HR",
  MANAGER = "MANAGER",
  OTHER = "OTHER",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  UPDATED = "UPDATED",
  CANCELLED = "CANCELLED",
}

@Schema({ _id: false })
export class Participant {
  @Prop({ required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  role?: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

@Schema({ timestamps: true })
export class Interview {
  @Prop({ type: String, default: () => new Types.ObjectId().toHexString() })
  _id: string;

  @Prop({ required: true })
  candidateId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: InterviewType, default: InterviewType.INITIAL })
  type: InterviewType;

  @Prop({ type: String, enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Prop({ type: Date, required: true })
  startAt: Date;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop()
  location?: string;

  @Prop({ type: [ParticipantSchema], default: [] })
  participants: Participant[];

  @Prop()
  externalCalendarId?: string;

  @Prop()
  organizationId?: string;

  @Prop()
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const interviewSchema = SchemaFactory.createForClass(Interview);
