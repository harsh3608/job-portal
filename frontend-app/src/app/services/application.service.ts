import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JobApplication, CreateApplicationRequest, UpdateApplicationStatusRequest } from '../models/application.models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/applications/api/applications`;

    getAll() {
        return this.http.get<JobApplication[]>(this.apiUrl);
    }

    getById(id: number) {
        return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
    }

    getByCandidate(candidateId: number) {
        return this.http.get<JobApplication[]>(`${this.apiUrl}/candidate/${candidateId}`);
    }

    getByJob(jobId: number) {
        return this.http.get<JobApplication[]>(`${this.apiUrl}/job/${jobId}`);
    }

    create(request: CreateApplicationRequest) {
        return this.http.post<JobApplication>(this.apiUrl, request);
    }

    updateStatus(id: number, request: UpdateApplicationStatusRequest) {
        return this.http.patch<JobApplication>(`${this.apiUrl}/${id}/status`, request);
    }
}
