import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Candidate, CandidateDocument, CandidateStatus } from "./schemas/candidate.schema";
import { CreateCandidateInput } from "./dto/create-candidate.input";
import { UpdateCandidateStatusInput } from "./dto/update-status.input";

@Injectable()
export class CandidatesService {
  constructor(@InjectModel(Candidate.name) private candidateModel: Model<CandidateDocument>) {}

  private parseFormData(raw?: string): Record<string, any> | undefined {
    if (!raw) return undefined;
    try {
      return JSON.parse(raw);
    } catch (e) {
      throw new BadRequestException('formData must be valid JSON');
    }
  }

  async createCandidate(input: CreateCandidateInput, userId?: string): Promise<Candidate> {
    const formData = this.parseFormData(input.formData);

    const candidate = new this.candidateModel({
      ...input,
      formData,
      history: [
        {
          status: CandidateStatus.NEW,
          changedAt: new Date(),
          changedBy: userId,
        },
      ],
    });
    return candidate.save();
  }

  async list(organizationId?: string): Promise<Candidate[]> {
    const filter = organizationId ? { organizationId } : {};
    return this.candidateModel.find(filter).lean().exec();
  }

  async findById(id: string): Promise<Candidate | null> {
    return this.candidateModel.findById(id).lean().exec();
  }

  async updateStatus(input: UpdateCandidateStatusInput, userId?: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(input.candidateId).exec();
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    candidate.status = input.status;
    candidate.history.push({
      status: input.status,
      changedAt: new Date(),
      changedBy: userId,
      note: input.note,
    });

    await candidate.save();
    return candidate.toObject();
  }
}
