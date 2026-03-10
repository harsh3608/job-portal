export type ApplicationStatus = 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';

export interface JobApplication {
    id: number;
    jobId: number;
    candidateId: number;
    coverLetter: string;
    status: ApplicationStatus;
    appliedAt: string;
    updatedAt?: string;
}

export interface CreateApplicationRequest {
    jobId: number;
    candidateId: number;
    coverLetter: string;
}

export interface UpdateApplicationStatusRequest {
    status: ApplicationStatus;
}
