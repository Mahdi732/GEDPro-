import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Candidate, candidateSchema } from "./schemas/candidate.schema";
import { CandidatesService } from "./candidates.service";
import { CandidatesResolver } from "./candidates.resolver";
import { RolesGuard } from "../guards/roles.guard";

@Module({
  imports: [MongooseModule.forFeature([{ name: Candidate.name, schema: candidateSchema }])],
  providers: [CandidatesService, CandidatesResolver, RolesGuard],
  exports: [CandidatesService],
})
export class CandidatesModule {}
