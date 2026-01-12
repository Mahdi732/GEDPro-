import { ObjectType, Field, GraphQLISODateTime, Int, registerEnumType } from "@nestjs/graphql";
import { InterviewStatus, InterviewType } from "../schemas/interview.schema";

registerEnumType(InterviewType, { name: 'InterviewType' });
registerEnumType(InterviewStatus, { name: 'InterviewStatus' });

@ObjectType()
export class ParticipantResponse {
  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  role?: string;
}

@ObjectType()
export class InterviewResponse {
  @Field()
  _id: string;

  @Field()
  candidateId: string;

  @Field()
  title: string;

  @Field(() => String)
  type: InterviewType;

  @Field(() => String)
  status: InterviewStatus;

  @Field(() => GraphQLISODateTime)
  startAt: Date;

  @Field(() => Int)
  durationMinutes: number;

  @Field({ nullable: true })
  location?: string;

  @Field(() => [ParticipantResponse])
  participants: ParticipantResponse[];

  @Field({ nullable: true })
  externalCalendarId?: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
