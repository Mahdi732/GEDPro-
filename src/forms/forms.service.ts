import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Form, FormDocument } from "./schemas/form.schema";
import { FormResponse, FormResponseDocument } from "./schemas/response.schema";
import { CreateFormInput } from "./dto/create-form.input";

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    @InjectModel(FormResponse.name) private responseModel: Model<FormResponseDocument>,
  ) {}

  async createForm(input: CreateFormInput): Promise<Form> {
    const created = new this.formModel(input);
    return created.save();
  }

  async findById(id: string): Promise<Form | null> {
    return this.formModel.findById(id).lean().exec();
  }

  async list(organizationId?: string): Promise<Form[]> {
    const filter = organizationId ? { organizationId } : {};
    return this.formModel.find(filter).lean().exec();
  }

  async submitResponse(formId: string, data: Record<string, any>, submitterId?: string): Promise<FormResponse> {
    // Ensure the form exists before saving a response (simple validation)
    const form = await this.formModel.findById(formId).exec();
    if (!form) {
      throw new Error('Form not found');
    }

    const doc = new this.responseModel({ formId, data, submitterId });
    return doc.save();
  }

  async listResponses(formId: string): Promise<FormResponse[]> {
    return this.responseModel.find({ formId }).lean().exec();
  }
}
