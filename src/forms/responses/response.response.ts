import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class FormSubmissionResponse {
  @Field()
  _id: string;

  @Field()
  formId: string;

  @Field(() => String)
  data: string; // JSON string of submitted values

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  submitterId?: string;

  @Field({ nullable: true })
  createdAt?: Date;
}
