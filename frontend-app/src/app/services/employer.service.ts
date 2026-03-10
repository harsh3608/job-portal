import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employer, CreateEmployerRequest } from '../models/employer.models';

@Injectable({ providedIn: 'root' })
export class EmployerService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/employers/api/employers`;

    getAll() {
        return this.http.get<Employer[]>(this.apiUrl);
    }

    getById(id: number) {
        return this.http.get<Employer>(`${this.apiUrl}/${id}`);
    }

    create(request: CreateEmployerRequest) {
        return this.http.post<Employer>(this.apiUrl, request);
    }

    update(id: number, request: CreateEmployerRequest) {
        return this.http.put<Employer>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
