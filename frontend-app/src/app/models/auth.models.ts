export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    role: string; // 'Candidate' | 'Employer'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: string;
    expiresAt: string;
}

export interface CurrentUser {
    token: string;
    email: string;
    role: string;
    expiresAt: string;
}
