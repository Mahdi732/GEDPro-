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
import { User, UserRole } from "./schemas/auth.schema";

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.register(registerInput);
    return user;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.login(loginInput);
    return user;
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('role', { nullable: true }) role?: string,
    @CurrentUser() currentUser?: any,
  ): Promise<Omit<User, 'password'>> {
    const userId = currentUser._id || currentUser.userId;
    const updateData: { name?: string; email?: string; role?: UserRole } = {
      name,
      email,
      role: role ? (role as UserRole) : undefined,
    };
    const user = await this.authService.updateProfile(userId, updateData);
    return user;
  }

  @Query(() => [AuthResponse])
  @UseGuards(JwtAuthGuard)
  async findUsersByName(
    @Args('name') name: string,
  ): Promise<Omit<User, 'password'>[]> {
    const users = await this.authService.findByName(name);
    return users;
  }

  @Query(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser() currentUser: any,
  ): Promise<Omit<User, 'password'>> {
    return currentUser;
  }
}