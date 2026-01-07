import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  _id: String;

  @Field(() => String)
  name: String;

  @Field(() => String)
  email: String;

  @Field(() => String, { nullable: true })
  role?: String;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
