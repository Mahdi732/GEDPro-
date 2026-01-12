import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CandidatesService } from "../candidates/candidates.service";
import { Candidate, CandidateStatus } from "../candidates/schemas/candidate.schema";
import { Interview, InterviewDocument, InterviewStatus } from "./schemas/interview.schema";
import { ScheduleInterviewInput } from "./dto/schedule-interview.input";
import { UpdateInterviewInput } from "./dto/update-interview.input";

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name) private interviewModel: Model<InterviewDocument>,
    @InjectModel(Candidate.name) private candidateModel: Model<any>,
    private readonly candidatesService: CandidatesService,
  ) {}

  private async ensureCandidate(candidateId: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(candidateId).lean().exec();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate as unknown as Candidate;
  }

  private async syncWithCalendar(payload: { title: string; startAt: Date; durationMinutes: number; participants?: { email: string; name?: string }[]; notes?: string; }): Promise<string> {
    // Placeholder for integration with Google Calendar / CalDAV / Outlook. Return a synthetic id for now.
    const suffix = Math.floor(Date.now() / 1000);
    return `CAL-${suffix}`;
  }

  async schedule(input: ScheduleInterviewInput, userId?: string): Promise<Interview> {
    const candidate = await this.ensureCandidate(input.candidateId);

    const interview = new this.interviewModel({
      ...input,
      organizationId: input.organizationId || candidate.organizationId,
    });

    interview.externalCalendarId = await this.syncWithCalendar({
      title: input.title,
      startAt: new Date(input.startAt),
      durationMinutes: input.durationMinutes,
      participants: input.participants,
      notes: input.notes,
    });

    await interview.save();

    // Update candidate status to reflect scheduled interview
    await this.candidatesService.updateStatus(
      { candidateId: input.candidateId, status: CandidateStatus.INTERVIEW_SCHEDULED },
      userId,
    );

    return interview.toObject();
  }

  async update(input: UpdateInterviewInput): Promise<Interview> {
    const interview = await this.interviewModel.findById(input.interviewId).exec();
    if (!interview) throw new NotFoundException('Interview not found');

    const updatable: Partial<Interview> = {};
    if (input.title !== undefined) updatable.title = input.title;
    if (input.type !== undefined) updatable.type = input.type;
    if (input.startAt !== undefined) updatable.startAt = input.startAt;
    if (input.durationMinutes !== undefined) updatable.durationMinutes = input.durationMinutes;
    if (input.location !== undefined) updatable.location = input.location;
    if (input.notes !== undefined) updatable.notes = input.notes;
    if (input.status !== undefined) updatable.status = input.status;

    Object.assign(interview, updatable);
    await interview.save();
    return interview.toObject();
  }

  async cancel(interviewId: string): Promise<Interview> {
    const interview = await this.interviewModel.findById(interviewId).exec();
    if (!interview) throw new NotFoundException('Interview not found');
    interview.status = InterviewStatus.CANCELLED;
    await interview.save();
    return interview.toObject();
  }

  async listByCandidate(candidateId: string): Promise<Interview[]> {
    await this.ensureCandidate(candidateId);
    return this.interviewModel.find({ candidateId }).lean().exec();
  }

  async list(organizationId?: string): Promise<Interview[]> {
    const filter = organizationId ? { organizationId } : {};
    return this.interviewModel.find(filter).lean().exec();
  }
}
