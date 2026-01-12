import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FormsService } from "./forms.service";
import { CreateFormInput } from "./dto/create-form.input";
import { FormResponseType } from "./responses/form.response";
import { FormSubmissionResponse } from "./responses/response.response";
import { BadRequestException, ForbiddenException, NotFoundException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { SubmitFormInput } from "./dto/submit-form.input";

@Resolver(() => FormResponseType)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation(() => FormResponseType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH')
  async createForm(@Args('input') input: CreateFormInput, @CurrentUser() currentUser?: any) {
    // If organizationId not provided, inherit from current user (simple behavior)
    input.organizationId = input.organizationId || currentUser?.organizationId;
    return this.formsService.createForm(input as any);
  }

  @Query(() => [FormResponseType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async listForms(
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @CurrentUser() currentUser?: any,
  ) {
    const orgFilter = organizationId || currentUser?.organizationId;
    const isAdmin = currentUser?.role === 'ADMIN';
    if (!isAdmin && organizationId && currentUser?.organizationId && organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('You cannot query forms for another organization');
    }
    return this.formsService.list(orgFilter);
  }

  @Query(() => FormResponseType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async getForm(@Args('id') id: string, @CurrentUser() currentUser?: any) {
    const form = await this.formsService.findById(id);
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    const isAdmin = currentUser?.role === 'ADMIN';
    if (!isAdmin && currentUser?.organizationId && form.organizationId && form.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('You cannot access a form from another organization');
    }

    return form;
  }

  @Mutation(() => FormSubmissionResponse)
  async submitFormResponse(
    @Args('input') input: SubmitFormInput,
    @CurrentUser() currentUser?: any,
  ) {
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(input.data);
    } catch (e) {
      throw new BadRequestException('Payload data must be valid JSON');
    }

    const submitterId = currentUser?.userId || currentUser?._id || undefined;
    const res = await this.formsService.submitResponse(input.formId, parsed, submitterId);
    return {
      _id: res._id,
      formId: res.formId,
      data: JSON.stringify(res.data),
      submitterId: res.submitterId,
      organizationId: res.organizationId,
      createdAt: res.createdAt,
    } as FormSubmissionResponse;
  }

  @Query(() => [FormSubmissionResponse])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RH', 'MANAGER')
  async listResponses(@Args('formId') formId: string, @CurrentUser() currentUser?: any) {
    const form = await this.formsService.findById(formId);
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    const isAdmin = currentUser?.role === 'ADMIN';
    if (!isAdmin && currentUser?.organizationId && form.organizationId && form.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('You cannot access submissions from another organization');
    }

    const rs = await this.formsService.listResponses(formId);
    return rs.map(r => ({
      _id: r._id,
      formId: r.formId,
      data: JSON.stringify(r.data),
      submitterId: r.submitterId,
      organizationId: r.organizationId,
      createdAt: r.createdAt,
    }));
  }
}
