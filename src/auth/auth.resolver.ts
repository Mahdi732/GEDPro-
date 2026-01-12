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
    @Context() ctx?: any,
  ): Promise<AuthResponse> {
    const user = await this.authService.register(registerInput);
    const accessToken = this.authService.createAccessToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: (Number(process.env.JWT_COOKIE_MAX_AGE) || 3600) * 1000,
      path: '/',
    };

    try {
      ctx?.res?.cookie?.('accessToken', accessToken, cookieOptions);
    } catch (e) {
      // best-effort: set header if `res.cookie` not available
      const maxAgeSec = cookieOptions.maxAge ? cookieOptions.maxAge / 1000 : 3600;
      ctx?.res?.setHeader?.('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${cookieOptions.secure ? '; Secure' : ''}`);
    }

    return user as AuthResponse;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx?: any,
  ): Promise<AuthResponse> {
    const user = await this.authService.login(loginInput);
    const accessToken = this.authService.createAccessToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: (Number(process.env.JWT_COOKIE_MAX_AGE) || 3600) * 1000,
      path: '/',
    };

    try {
      ctx?.res?.cookie?.('accessToken', accessToken, cookieOptions);
    } catch (e) {
      const maxAgeSec = cookieOptions.maxAge ? cookieOptions.maxAge / 1000 : 3600;
      ctx?.res?.setHeader?.('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${cookieOptions.secure ? '; Secure' : ''}`);
    }

    return user as AuthResponse;
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('role', { nullable: true }) role?: string,
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @CurrentUser() currentUser?: any,
  ): Promise<Omit<User, 'password'>> {
    const userId = currentUser._id || currentUser.userId;
    const updateData: { name?: string; email?: string; role?: UserRole; organizationId?: string } = {
      name,
      email,
      role: role ? (role as UserRole) : undefined,
      organizationId,
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