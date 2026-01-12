import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CandidatesService } from "./candidates.service";
import { CandidateResponse } from "./responses/candidate.response";
import { CreateCandidateInput } from "./dto/create-candidate.input";
import { UpdateCandidateStatusInput } from "./dto/update-status.input";
import { UseGuards, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { CurrentUser } from "../decorators/current-user.decorator";

@Resolver(() => CandidateResponse)
export class CandidatesResolver {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Mutation(() => CandidateResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async createCandidate(
    @Args('input') input: CreateCandidateInput,
    @CurrentUser() currentUser?: any,
  ) {
    input.organizationId = input.organizationId || currentUser?.organizationId;
    return this.candidatesService.createCandidate(input, currentUser?._id || currentUser?.userId);
  }

  @Query(() => [CandidateResponse])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async listCandidates(
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @CurrentUser() currentUser?: any,
  ) {
    const orgId = organizationId || currentUser?.organizationId;
    if (organizationId && currentUser?.organizationId && organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot list candidates for another organization');
    }
    return this.candidatesService.list(orgId);
  }

  @Query(() => CandidateResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async getCandidate(
    @Args('id') id: string,
    @CurrentUser() currentUser?: any,
  ) {
    const candidate = await this.candidatesService.findById(id);
    if (!candidate) return null;
    if (candidate.organizationId && currentUser?.organizationId && candidate.organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot access candidate from another organization');
    }
    return candidate;
  }

  @Mutation(() => CandidateResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async updateCandidateStatus(
    @Args('input') input: UpdateCandidateStatusInput,
    @CurrentUser() currentUser?: any,
  ) {
    const candidate = await this.candidatesService.findById(input.candidateId);
    if (!candidate) return null;
    if (candidate.organizationId && currentUser?.organizationId && candidate.organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot update candidate from another organization');
    }
    return this.candidatesService.updateStatus(input, currentUser?._id || currentUser?.userId);
  }
}
