import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { FormsService } from "./forms.service";
import { CreateFormInput } from "./dto/create-form.input";
import { FormResponseType } from "./responses/form.response";
import { FormSubmissionResponse } from "./responses/response.response";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Roles } from "../decorators/roles.decorator";
import { SubmitFormInput } from "./dto/submit-form.input";

@Resolver(() => FormResponseType)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation(() => FormResponseType)
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'RH')
  async createForm(@Args('input') input: CreateFormInput, @CurrentUser() currentUser?: any) {
    // If organizationId not provided, inherit from current user (simple behavior)
    if (!input.organizationId && currentUser?.organizationId) {
      input.organizationId = currentUser.organizationId;
    }
    return this.formsService.createForm(input as any);
  }

  @Query(() => [FormResponseType])
  @UseGuards(JwtAuthGuard)
  async listForms(@Args('organizationId', { nullable: true }) organizationId?: string) {
    return this.formsService.list(organizationId);
  }

  @Query(() => FormResponseType)
  @UseGuards(JwtAuthGuard)
  async getForm(@Args('id') id: string) {
    return this.formsService.findById(id);
  }

  @Mutation(() => FormSubmissionResponse)
  async submitFormResponse(
    @Args('input') input: SubmitFormInput,
    @CurrentUser() currentUser?: any,
  ) {
    const parsed = JSON.parse(input.data);
    const submitterId = currentUser?.userId || currentUser?._id || undefined;
    const res = await this.formsService.submitResponse(input.formId, parsed, submitterId);
    return { _id: res._id, formId: res.formId, data: JSON.stringify(res.data), submitterId: res.submitterId, createdAt: res.createdAt } as FormSubmissionResponse;
  }

  @Query(() => [FormSubmissionResponse])
  @UseGuards(JwtAuthGuard)
  async listResponses(@Args('formId') formId: string) {
    const rs = await this.formsService.listResponses(formId);
    return rs.map(r => ({ _id: r._id, formId: r.formId, data: JSON.stringify(r.data), submitterId: r.submitterId, createdAt: r.createdAt }));
  }
}
