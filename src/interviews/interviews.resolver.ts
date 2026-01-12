import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InterviewsService } from "./interviews.service";
import { InterviewResponse } from "./responses/interview.response";
import { ScheduleInterviewInput } from "./dto/schedule-interview.input";
import { UpdateInterviewInput } from "./dto/update-interview.input";
import { UseGuards, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { CurrentUser } from "../decorators/current-user.decorator";

@Resolver(() => InterviewResponse)
export class InterviewsResolver {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Mutation(() => InterviewResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async scheduleInterview(
    @Args('input') input: ScheduleInterviewInput,
    @CurrentUser() currentUser?: any,
  ) {
    input.organizationId = input.organizationId || currentUser?.organizationId;
    return this.interviewsService.schedule(input, currentUser?._id || currentUser?.userId);
  }

  @Mutation(() => InterviewResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async updateInterview(
    @Args('input') input: UpdateInterviewInput,
    @CurrentUser() currentUser?: any,
  ) {
    const interview = await this.interviewsService.update(input);
    if (interview.organizationId && currentUser?.organizationId && interview.organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot update interviews from another organization');
    }
    return interview;
  }

  @Mutation(() => InterviewResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async cancelInterview(
    @Args('id') id: string,
    @CurrentUser() currentUser?: any,
  ) {
    const interview = await this.interviewsService.cancel(id);
    if (interview.organizationId && currentUser?.organizationId && interview.organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot cancel interviews from another organization');
    }
    return interview;
  }

  @Query(() => [InterviewResponse])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async listInterviews(
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @CurrentUser() currentUser?: any,
  ) {
    const orgId = organizationId || currentUser?.organizationId;
    if (organizationId && currentUser?.organizationId && organizationId !== currentUser.organizationId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot list interviews for another organization');
    }
    return this.interviewsService.list(orgId);
  }

  @Query(() => [InterviewResponse])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async listInterviewsByCandidate(
    @Args('candidateId') candidateId: string,
    @CurrentUser() currentUser?: any,
  ) {
    const interviews = await this.interviewsService.listByCandidate(candidateId);
    if (currentUser?.organizationId && interviews.some(i => i.organizationId && i.organizationId !== currentUser.organizationId) && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Cannot access interviews from another organization');
    }
    return interviews;
  }
}
