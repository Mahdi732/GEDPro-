import {Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { User, userSchema } from "./schemas/auth.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema}])
  ],
  providers: [AuthResolver, AuthService],
})

export class AuthModule { }