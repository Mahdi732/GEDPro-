import { InputType, Field, Int } from "@nestjs/graphql";
import { FieldType } from "../schemas/form.schema";

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

  @Field(() => [FormFieldInput])
  fields: FormFieldInput[];

  @Field({ nullable: true })
  organizationId?: string;
}
