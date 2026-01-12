import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
