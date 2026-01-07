import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsEmail, MinLength, IsOptional, Matches, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class RegisterInput {
  @Field(() => String, {
    nullable: false 
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "Name can only contain letters and spaces"
  })
  @Transform(({ value }) => value.trim())
  name: string;

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

  @Field(() => String, { 
    nullable: true 
  })
  @IsOptional()
  @IsString({ message: "Role must be a string" })
  role?: string;
}