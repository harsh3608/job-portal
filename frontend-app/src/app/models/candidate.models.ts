export interface Candidate {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
    experienceYears: number;
    resumeUrl: string;
    createdAt: string;
}

export interface CreateCandidateRequest {
    fullName: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
    experienceYears: number;
}
