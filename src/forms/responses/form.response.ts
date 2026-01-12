import { ObjectType, Field, Int } from "@nestjs/graphql";
import { FieldType, FormPurpose } from "../schemas/form.schema";

@ObjectType()
export class FormFieldResponse {
  @Field()
  label: string;

  @Field()
  name: string;

  @Field(() => String)
  type: FieldType;

  @Field({ nullable: true })
  required?: boolean;

  @Field(() => [String], { nullable: true })
  options?: string[];

  @Field(() => Int, { nullable: true })
  order?: number;
}

@ObjectType()
export class FormResponseType {
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  purpose?: FormPurpose;

  @Field({ nullable: true })
  linkedOfferId?: string;

  @Field({ nullable: true })
  processKey?: string;

  @Field(() => [FormFieldResponse])
  fields: FormFieldResponse[];

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
