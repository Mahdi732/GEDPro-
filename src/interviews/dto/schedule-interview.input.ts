import { InputType, Field, Int, GraphQLISODateTime } from "@nestjs/graphql";
import { InterviewType } from "../schemas/interview.schema";

@InputType()
export class ParticipantInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  role?: string;
}

@InputType()
export class ScheduleInterviewInput {
  @Field()
  candidateId: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  type?: InterviewType;

  @Field(() => GraphQLISODateTime)
  startAt: Date;

  @Field(() => Int)
  durationMinutes: number;

  @Field({ nullable: true })
  location?: string;

  @Field(() => [ParticipantInput], { nullable: true })
  participants?: ParticipantInput[];

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  organizationId?: string;
}
