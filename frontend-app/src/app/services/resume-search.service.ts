import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resume } from '../models/resume.models';

@Injectable({ providedIn: 'root' })
export class ResumeSearchService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/resume-search/api/resumesearch`;

    search(q: string) {
        const params = new HttpParams().set('q', q);
        return this.http.get<Resume[]>(this.apiUrl, { params });
    }

    getById(id: string) {
        return this.http.get<Resume>(`${this.apiUrl}/${id}`);
    }

    index(resume: Resume) {
        return this.http.post<Resume>(this.apiUrl, resume);
    }

    delete(id: string) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
