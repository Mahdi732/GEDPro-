import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateCandidateInput {
  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  formId?: string;

  @Field({ nullable: true })
  formResponseId?: string;

  @Field({ nullable: true })
  formData?: string; // JSON string payload of the form submission

  @Field({ nullable: true })
  organizationId?: string;
}
