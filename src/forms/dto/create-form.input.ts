import { InputType, Field, Int } from "@nestjs/graphql";
import { FieldType, FormPurpose } from "../schemas/form.schema";

@InputType()
export class FormFieldInput {
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

@InputType()
export class CreateFormInput {
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

  @Field(() => [FormFieldInput])
  fields: FormFieldInput[];

  @Field({ nullable: true })
  organizationId?: string;
}
