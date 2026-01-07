import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register.input";
import { LoginInput } from "./dto/login.input";
import { AuthResponse } from "./responses/auth.response";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    const user = await this.authService.register(registerInput);
    return user as AuthResponse;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    const user = await this.authService.login(loginInput);
    return user as AuthResponse;
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('role', { nullable: true }) role?: string,
    @CurrentUser() currentUser?: any,
  ): Promise<AuthResponse> {
    const userId = currentUser._id || currentUser.userId;
    const updateData = { name, email, role };
    const user = await this.authService.updateProfile(userId, updateData);
    return user as AuthResponse;
  }

  @Query(() => [AuthResponse])
  @UseGuards(JwtAuthGuard)
  async findUsersByName(
    @Args('name') name: string,
  ): Promise<AuthResponse[]> {
    const users = await this.authService.findByName(name);
    return users as AuthResponse[];
  }

  @Query(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser() currentUser: any,
  ): Promise<AuthResponse> {
    // Assuming you'll add a getProfile method to your AuthService
    // For now, returning the currentUser from the context
    return currentUser as AuthResponse;
  }
}