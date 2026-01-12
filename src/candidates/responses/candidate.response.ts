import { ObjectType, Field, registerEnumType, GraphQLISODateTime } from "@nestjs/graphql";
import { CandidateStatus } from "../schemas/candidate.schema";

registerEnumType(CandidateStatus, { name: 'CandidateStatus' });

@ObjectType()
export class StatusChangeResponse {
  @Field(() => String)
  status: CandidateStatus;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  changedBy?: string;

  @Field(() => GraphQLISODateTime)
  changedAt: Date;
}

@ObjectType()
export class CandidateResponse {
  @Field()
  _id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => String)
  status: CandidateStatus;

  @Field(() => [StatusChangeResponse])
  history: StatusChangeResponse[];

  @Field({ nullable: true })
  formId?: string;

  @Field({ nullable: true })
  formResponseId?: string;

  @Field({ nullable: true })
  formData?: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
