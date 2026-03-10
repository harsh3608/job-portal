export interface Employer {
    id: number;
    companyName: string;
    industry: string;
    website: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
    createdAt: string;
}

export interface CreateEmployerRequest {
    companyName: string;
    industry: string;
    website: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
}
