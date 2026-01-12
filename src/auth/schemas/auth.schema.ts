import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Exclude } from "class-transformer";

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = "ADMIN",
  RH = "RH",
  MANAGER = "MANAGER",
  USER = "USER"
}

@Schema({timestamps : true})
export class User {

    @Prop({
    type: String,
    default: () => uuidv4()
  })
  _id: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    select: false
  })
  @Exclude()
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Prop({ trim: true })
  organizationId?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  // Timestamps added by Mongoose when `timestamps: true` is enabled on the schema.
  // Declare them here so TypeScript knows these properties may exist on `User` objects.
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = SchemaFactory.createForClass(User)