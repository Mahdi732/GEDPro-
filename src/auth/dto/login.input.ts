import { IsString, IsEmail, MinLength, IsNotEmpty } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field(() => String, {
    nullable: false 
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { 
    message: "Please provide a valid email address" 
  })
  email: string;

  @Field(() => String, {
    nullable: false 
  })
  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { 
    message: "Password must be at least 8 characters long" 
  })
  password: string;
}