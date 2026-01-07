import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class SubmitFormInput {
  @Field()
  formId: string;

  @Field()
  data: string; // JSON string of submitted values
}
