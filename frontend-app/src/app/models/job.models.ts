export type JobType = 'FullTime' | 'PartTime' | 'Contract' | 'Remote';
export type JobStatus = 'Open' | 'Closed' | 'Paused';

export interface Job {
    id: number;
    employerId: number;
    title: string;
    company: string;
    location: string;
    description: string;
    requiredSkills: string[];
    minExperienceYears: number;
    salaryMin?: number;
    salaryMax?: number;
    type: JobType;
    status: JobStatus;
    postedAt: string;
    expiresAt?: string;
}

export interface CreateJobRequest {
    employerId: number;
    title: string;
    company: string;
    location: string;
    description: string;
    requiredSkills: string[];
    minExperienceYears: number;
    salaryMin?: number;
    salaryMax?: number;
    type: JobType;
    expiresAt?: string;
}

export interface JobFilters {
    title?: string;
    location?: string;
    skill?: string;
}
