import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FieldType, Form, FormDocument, FormPurpose } from "./schemas/form.schema";
import { FormResponse, FormResponseDocument } from "./schemas/response.schema";
import { CreateFormInput } from "./dto/create-form.input";

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    @InjectModel(FormResponse.name) private responseModel: Model<FormResponseDocument>,
  ) {}

  private validateFormDefinition(input: CreateFormInput) {
    if (!input.fields || input.fields.length === 0) {
      throw new BadRequestException('A form must contain at least one field');
    }

    const seen = new Set<string>();
    input.fields.forEach((field, idx) => {
      if (!field.name || !field.label) {
        throw new BadRequestException(`Field at position ${idx + 1} is missing a name or label`);
      }

      if (seen.has(field.name)) {
        throw new BadRequestException(`Duplicate field name "${field.name}"`);
      }
      seen.add(field.name);

      if (!Object.values(FieldType).includes(field.type)) {
        throw new BadRequestException(`Unsupported field type for ${field.name}`);
      }

      if (field.type === FieldType.SELECT && (!field.options || field.options.length === 0)) {
        throw new BadRequestException(`Field "${field.name}" requires at least one option`);
      }
    });
  }

  private validatePayloadAgainstForm(form: Form, data: Record<string, any>): Record<string, any> {
    const errors: string[] = [];
    const cleaned: Record<string, any> = {};
    const allowedNames = new Set(form.fields.map((field) => field.name));

    form.fields.forEach((field) => {
      const value = data?.[field.name];

      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field "${field.label}" is required`);
        return;
      }

      if (value === undefined || value === null || value === '') {
        return;
      }

      switch (field.type) {
        case FieldType.TEXT:
          if (typeof value !== 'string') {
            errors.push(`Field "${field.label}" must be a string`);
          } else {
            cleaned[field.name] = value.trim();
          }
          break;
        case FieldType.EMAIL:
          if (typeof value !== 'string') {
            errors.push(`Field "${field.label}" must be an email string`);
            break;
          }
          if (!/^\S+@\S+\.\S+$/.test(value.trim())) {
            errors.push(`Field "${field.label}" must be a valid email`);
            break;
          }
          cleaned[field.name] = value.trim().toLowerCase();
          break;
        case FieldType.NUMBER: {
          const num = typeof value === 'number' ? value : Number(value);
          if (Number.isNaN(num)) {
            errors.push(`Field "${field.label}" must be a number`);
          } else {
            cleaned[field.name] = num;
          }
          break;
        }
        case FieldType.FILE:
          if (typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`Field "${field.label}" must be a file reference string`);
          } else {
            cleaned[field.name] = value.trim();
          }
          break;
        case FieldType.SELECT:
          if (!field.options || field.options.length === 0) {
            errors.push(`Field "${field.label}" has no options configured`);
            break;
          }
          if (typeof value !== 'string' || !field.options.includes(value)) {
            errors.push(`Field "${field.label}" must be one of: ${field.options.join(', ')}`);
            break;
          }
          cleaned[field.name] = value;
          break;
        case FieldType.DATE: {
          const dateValue = new Date(value);
          if (Number.isNaN(dateValue.getTime())) {
            errors.push(`Field "${field.label}" must be a valid date`);
          } else {
            cleaned[field.name] = dateValue.toISOString();
          }
          break;
        }
        default:
          errors.push(`Unsupported field type for "${field.label}"`);
      }
    });

    Object.keys(data || {}).forEach((key) => {
      if (!allowedNames.has(key)) {
        errors.push(`Field "${key}" is not part of the form definition`);
      }
    });

    if (errors.length) {
      throw new BadRequestException(`Invalid form submission: ${errors.join('; ')}`);
    }

    return cleaned;
  }

  async createForm(input: CreateFormInput): Promise<Form> {
    this.validateFormDefinition(input);

    const payload: Partial<Form> = {
      ...input,
      purpose: input.purpose || FormPurpose.GENERIC,
      fields: [...input.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    };

    const created = new this.formModel(payload);
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
    const form = await this.formModel.findById(formId).lean().exec();
    if (!form) {
      throw new BadRequestException('Form not found');
    }

    const validatedData = this.validatePayloadAgainstForm(form, data);

    const doc = new this.responseModel({
      formId,
      data: validatedData,
      submitterId,
      organizationId: form.organizationId,
    });
    return doc.save();
  }

  async listResponses(formId: string): Promise<FormResponse[]> {
    return this.responseModel.find({ formId }).lean().exec();
  }
}
