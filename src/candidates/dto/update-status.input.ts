import { InputType, Field } from "@nestjs/graphql";
import { CandidateStatus } from "../schemas/candidate.schema";

@InputType()
export class UpdateCandidateStatusInput {
  @Field()
  candidateId: string;

  @Field(() => String)
  status: CandidateStatus;

  @Field({ nullable: true })
  note?: string;
}
