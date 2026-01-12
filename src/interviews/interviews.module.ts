import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewsService } from "./interviews.service";
import { InterviewsResolver } from "./interviews.resolver";
import { Interview, interviewSchema } from "./schemas/interview.schema";
import { Candidate, candidateSchema } from "../candidates/schemas/candidate.schema";
import { CandidatesModule } from "../candidates/candidates.module";
import { RolesGuard } from "../guards/roles.guard";

@Module({
  imports: [
    CandidatesModule,
    MongooseModule.forFeature([
      { name: Interview.name, schema: interviewSchema },
      { name: Candidate.name, schema: candidateSchema },
    ]),
  ],
  providers: [InterviewsService, InterviewsResolver, RolesGuard],
})
export class InterviewsModule {}
