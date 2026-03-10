import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Job, CreateJobRequest, JobFilters } from '../models/job.models';

@Injectable({ providedIn: 'root' })
export class JobService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/jobs/api/jobs`;

    getAll(filters?: JobFilters) {
        let params = new HttpParams();
        if (filters?.title) params = params.set('title', filters.title);
        if (filters?.location) params = params.set('location', filters.location);
        if (filters?.skill) params = params.set('skill', filters.skill);
        return this.http.get<Job[]>(this.apiUrl, { params });
    }

    getById(id: number) {
        return this.http.get<Job>(`${this.apiUrl}/${id}`);
    }

    getByEmployer(employerId: number) {
        return this.http.get<Job[]>(`${this.apiUrl}/employer/${employerId}`);
    }

    create(request: CreateJobRequest) {
        return this.http.post<Job>(this.apiUrl, request);
    }

    close(id: number) {
        return this.http.put<void>(`${this.apiUrl}/${id}/close`, {});
    }

    delete(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
