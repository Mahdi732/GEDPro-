import { InputType, Field, Int, GraphQLISODateTime } from "@nestjs/graphql";
import { InterviewStatus, InterviewType } from "../schemas/interview.schema";

@InputType()
export class UpdateInterviewInput {
  @Field()
  interviewId: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  type?: InterviewType;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startAt?: Date;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  status?: InterviewStatus;

  @Field({ nullable: true })
  notes?: string;
}
