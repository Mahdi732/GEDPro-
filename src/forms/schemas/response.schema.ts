import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FormResponseDocument = FormResponse & Document;

@Schema({ timestamps: true })
export class FormResponse {
  @Prop({ type: String, default: () => new Types.ObjectId().toHexString() })
  _id: string;

  @Prop({ required: true })
  formId: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop()
  organizationId?: string;

  @Prop()
  submitterId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const formResponseSchema = SchemaFactory.createForClass(FormResponse);
