import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { FormsModule } from './forms/forms.module';
import { AuthModule } from './auth/auth.module';
import { CandidatesModule } from './candidates/candidates.module';
import { InterviewsModule } from './interviews/interviews.module';

const uri = "mongodb://localhost:27017/gedPro";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(uri),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    FormsModule,
    AuthModule,
    CandidatesModule,
    InterviewsModule,
  ],
})
export class AppModule {}
