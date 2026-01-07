import { 
  BadRequestException, 
  Injectable, 
  NotFoundException,
  UnauthorizedException,
  ConflictException 
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { UserDocument, User, UserRole } from "./schemas/auth.schema";
import { RegisterInput } from "./dto/register.input";
import { LoginInput } from "./dto/login.input";

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<UserDocument>
  ) {}

  async register(registerInput: RegisterInput): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel.findOne({ 
      email: registerInput.email 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerInput.password, 
      this.SALT_ROUNDS
    );

    const newUser = new this.userModel({
      name: registerInput.name,
      email: registerInput.email,
      password: hashedPassword,
      role: registerInput.role || UserRole.USER,
    });

    const savedUser = await newUser.save();
    const { password, ...userWithoutPassword } = savedUser.toObject();
    
    return userWithoutPassword;
  }

  async login(loginInput: LoginInput): Promise<Omit<User, 'password'>> {
    const user = await this.userModel
      .findOne({ email: loginInput.email })
      .select('+password')
      .exec();

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password, 
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userObject = user.toObject();
    const { password, ...userWithoutPassword } = userObject;

    return userWithoutPassword;
  }

  async updateProfile(
    userId: string, 
    updateData: { name?: string; email?: string; role?: UserRole }
  ): Promise<Omit<User, 'password'>> {
    if (updateData.email) {
      const existingUser = await this.userModel.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...updateData },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async findByName(name: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel
      .find({
        name: name
       })
      .exec();

    return users.map(user => {
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
      return userWithoutPassword;
    });
  }
}