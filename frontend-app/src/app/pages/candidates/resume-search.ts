import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ResumeSearchService } from '../../services/resume-search.service';
import { Resume } from '../../models/resume.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-resume-search',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, ChipModule, TagModule, ProgressSpinnerModule, IconFieldModule, InputIconModule, SectionCard],
    template: `
        <div class="animate-fade-in">
            <section-card>
                <ng-template #title><i class="pi pi-file-search"></i> Resume Search</ng-template>
                <ng-template #description>Discover top talent with full-text search across all candidate resumes</ng-template>
                <div class="flex gap-3">
                    <p-iconfield class="flex-1">
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText [(ngModel)]="query" placeholder="Search by skills, title, or keywords..." class="w-full" style="font-size: 1rem; padding: 0.75rem 0.75rem 0.75rem 2.5rem;" (keyup.enter)="search()" />
                    </p-iconfield>
                    <p-button label="Search" icon="pi pi-search" [loading]="loading" (onClick)="search()" styleClass="h-full"></p-button>
                </div>
            </section-card>

            @if (loading) {
                <div class="flex justify-content-center p-8"><p-progressSpinner></p-progressSpinner></div>
            } @else if (searched && resumes.length === 0) {
                <section-card>
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="pi pi-search"></i></div>
                        <h3>No Results Found</h3>
                        <p>No resumes matched "{{ lastQuery }}". Try different keywords or broader terms.</p>
                    </div>
                </section-card>
            } @else if (resumes.length > 0) {
                <div class="flex align-items-center justify-content-between mb-4">
                    <span class="result-badge"><i class="pi pi-check-circle mr-1"></i>{{ resumes.length }} results for "{{ lastQuery }}"</span>
                </div>
                <div class="grid">
                    @for (resume of resumes; track resume.id) {
                        <div class="col-12 md:col-6 lg:col-4">
                        <div class="resume-card">
                            <div class="flex align-items-start gap-3 mb-3">
                                <div style="width: 44px; height: 44px; min-width: 44px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; font-weight: 700;">{{ resume.candidateName.charAt(0) || '?' }}</div>
                                <div class="flex-1 min-w-0">
                                    <h3 style="font-size: 1.05rem; font-weight: 600; margin: 0; color: var(--p-surface-900);">{{ resume.candidateName }}</h3>
                                    <p style="margin: 2px 0 0; font-size: 0.85rem; color: var(--p-surface-500);">{{ resume.title }}</p>
                                </div>
                                <p-tag [value]="resume.experienceYears + ' yrs'" severity="info"></p-tag>
                            </div>
                            <p style="font-size: 0.875rem; color: var(--p-surface-600); margin: 0 0 0.75rem; line-height: 1.5;">
                                {{ resume.summary ? (resume.summary.length > 120 ? (resume.summary | slice:0:120) + '...' : resume.summary) : 'No summary available.' }}
                            </p>
                            <div class="flex flex-wrap gap-1">
                                @for (skill of resume.skills; track skill) {
                                    <p-chip [label]="skill" styleClass="text-xs"></p-chip>
                                }
                            </div>
                        </div>
                        </div>
                    }
                </div>
            } @else {
                <section-card>
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="pi pi-file"></i></div>
                        <h3>Start Searching</h3>
                        <p>Enter keywords above to discover matching candidate resumes.</p>
                    </div>
                </section-card>
            }
        </div>
    `
})
export class ResumeSearch {
    private resumeService = inject(ResumeSearchService);

    query = '';
    lastQuery = '';
    resumes: Resume[] = [];
    loading = false;
    searched = false;

    search() {
        if (!this.query.trim()) return;
        this.loading = true;
        this.searched = true;
        this.lastQuery = this.query;
        this.resumeService.search(this.query).subscribe({
            next: (results) => { this.resumes = results; this.loading = false; },
            error: () => { this.resumes = []; this.loading = false; }
        });
    }
}
