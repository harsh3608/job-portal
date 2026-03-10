import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Candidate, CreateCandidateRequest } from '../models/candidate.models';

@Injectable({ providedIn: 'root' })
export class CandidateService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/candidates/api/candidates`;

    getAll() {
        return this.http.get<Candidate[]>(this.apiUrl);
    }

    getById(id: number) {
        return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
    }

    create(request: CreateCandidateRequest) {
        return this.http.post<Candidate>(this.apiUrl, request);
    }

    update(id: number, request: CreateCandidateRequest) {
        return this.http.put<Candidate>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
