import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FormDocument = Form & Document;

export enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  FILE = "FILE",
  SELECT = "SELECT",
  DATE = "DATE",
}

@Schema()
export class FormField {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: FieldType, required: true })
  type: FieldType;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [String], default: [] })
  options?: string[];

  @Prop({ default: 0 })
  order?: number;
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);

@Schema({ timestamps: true })
export class Form {
  @Prop({ type: String, default: () => new Types.ObjectId().toHexString() })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [FormFieldSchema], default: [] })
  fields: FormField[];

  @Prop()
  organizationId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const formSchema = SchemaFactory.createForClass(Form);
