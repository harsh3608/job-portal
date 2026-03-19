import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChipModule } from 'primeng/chip';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobFilters } from '../../models/job.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule, TextareaModule, MessageModule, ProgressSpinnerModule, IconFieldModule, InputIconModule, ChipModule, SectionCard],
    template: `
        <section-card>
            <ng-template #title><i class="pi pi-briefcase"></i> Browse Jobs</ng-template>
            <ng-template #description>Find your next opportunity</ng-template>
            <ng-template #action>
                @if (authService.currentUser()?.role === 'Employer') {
                    <p-button label="Post a Job" icon="pi pi-plus" routerLink="/jobs/post" severity="success"></p-button>
                }
            </ng-template>

            <div class="filter-bar">
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText [(ngModel)]="filters.title" placeholder="Job title..." (keyup.enter)="loadJobs()" />
                </p-iconfield>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-map-marker" />
                    <input pInputText [(ngModel)]="filters.location" placeholder="Location..." (keyup.enter)="loadJobs()" />
                </p-iconfield>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-tag" />
                    <input pInputText [(ngModel)]="filters.skill" placeholder="Skill..." (keyup.enter)="loadJobs()" />
                </p-iconfield>
                <p-button label="Search" icon="pi pi-search" (onClick)="loadJobs()"></p-button>
                <p-button label="Clear" icon="pi pi-times" severity="secondary" [outlined]="true" (onClick)="clearFilters()"></p-button>
                @if (jobs.length > 0) {
                    <span class="result-badge ml-auto"><i class="pi pi-list"></i> {{ jobs.length }} jobs found</span>
                }
            </div>

            @if (loading) {
                <div class="flex justify-content-center p-8"><p-progressSpinner></p-progressSpinner></div>
            } @else if (jobs.length === 0) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-search"></i></div>
                    <p class="empty-state-title">No jobs found</p>
                    <p class="empty-state-text">Try adjusting your search filters or check back later for new opportunities.</p>
                </div>
            } @else {
                <p-table [value]="jobs" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]"
                         [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
                         styleClass="p-datatable-striped">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>
                            <th pSortableColumn="company">Company <p-sortIcon field="company" /></th>
                            <th pSortableColumn="location">Location <p-sortIcon field="location" /></th>
                            <th>Skills</th>
                            <th pSortableColumn="type">Type <p-sortIcon field="type" /></th>
                            <th>Salary</th>
                            <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-job>
                        <tr>
                            <td>
                                <span class="font-semibold text-surface-900 dark:text-surface-0">{{ job.title }}</span>
                            </td>
                            <td><i class="pi pi-building mr-1 text-surface-400 text-xs"></i>{{ job.company }}</td>
                            <td><i class="pi pi-map-marker mr-1 text-surface-400 text-xs"></i>{{ job.location }}</td>
                            <td>
                                <div class="flex flex-wrap gap-1">
                                    @for (skill of job.requiredSkills?.slice(0, 3); track skill) {
                                        <p-chip [label]="skill" styleClass="text-xs"></p-chip>
                                    }
                                    @if (job.requiredSkills?.length > 3) {
                                        <span class="text-surface-500 text-xs self-center">+{{ job.requiredSkills.length - 3 }}</span>
                                    }
                                </div>
                            </td>
                            <td><p-tag [value]="job.type" [severity]="getJobTypeSeverity(job.type)"></p-tag></td>
                            <td>
                                @if (job.salaryMin || job.salaryMax) {
                                    <span class="text-sm font-medium">{{ formatSalary(job.salaryMin, job.salaryMax) }}</span>
                                } @else {
                                    <span class="text-surface-400 text-sm">N/A</span>
                                }
                            </td>
                            <td><p-tag [value]="job.status" [severity]="job.status === 'Open' ? 'success' : 'danger'"></p-tag></td>
                            <td>
                                <div class="flex gap-1">
                                    <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="info" (onClick)="viewJob(job)"></p-button>
                                    @if (authService.currentUser()?.role === 'Candidate' && job.status === 'Open') {
                                        <p-button icon="pi pi-send" [rounded]="true" [text]="true" severity="success" pTooltip="Apply" (onClick)="openApplyDialog(job)"></p-button>
                                    }
                                    @if (authService.currentUser()?.role === 'Employer') {
                                        <p-button icon="pi pi-lock" [rounded]="true" [text]="true" severity="warn" pTooltip="Close" (onClick)="closeJob(job)" [disabled]="job.status !== 'Open'"></p-button>
                                    }
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            }
        </section-card>

        <!-- Job Detail Dialog -->
        <p-dialog [(visible)]="showDetailDialog" [modal]="true" [style]="{ width: '640px' }" [header]="selectedJob?.title || 'Job Detail'" [draggable]="false">
            @if (selectedJob) {
                <div class="flex flex-column gap-4">
                    <div class="flex align-items-center gap-3">
                        <div style="width:48px;height:48px;border-radius:12px;background:var(--p-primary-50);display:flex;align-items:center;justify-content:center;">
                            <i class="pi pi-building text-primary text-xl"></i>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-surface-900 dark:text-surface-0">{{ selectedJob.title }}</div>
                            <div class="text-surface-500"><i class="pi pi-building mr-1 text-xs"></i>{{ selectedJob.company }} &middot; <i class="pi pi-map-marker mr-1 text-xs"></i>{{ selectedJob.location }}</div>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <p-tag [value]="selectedJob.type" [severity]="getJobTypeSeverity(selectedJob.type)"></p-tag>
                        <p-tag [value]="selectedJob.status" [severity]="selectedJob.status === 'Open' ? 'success' : 'danger'"></p-tag>
                        @if (selectedJob.salaryMin || selectedJob.salaryMax) {
                            <p-tag [value]="formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)" severity="info"></p-tag>
                        }
                        <p-tag [value]="'Exp: ' + selectedJob.minExperienceYears + '+ years'" severity="secondary"></p-tag>
                    </div>
                    <div>
                        <h4 class="text-surface-700 dark:text-surface-300 font-semibold mb-2"><i class="pi pi-align-left mr-2 text-xs"></i>Description</h4>
                        <p class="text-surface-600 dark:text-surface-400 whitespace-pre-line m-0 leading-relaxed">{{ selectedJob.description }}</p>
                    </div>
                    <div>
                        <h4 class="text-surface-700 dark:text-surface-300 font-semibold mb-2"><i class="pi pi-tag mr-2 text-xs"></i>Required Skills</h4>
                        <div class="flex flex-wrap gap-2">
                            @for (skill of selectedJob.requiredSkills; track skill) {
                                <p-chip [label]="skill"></p-chip>
                            }
                        </div>
                    </div>
                    <div class="text-surface-400 text-sm border-t border-surface-200 pt-3">
                        <i class="pi pi-calendar mr-1"></i>Posted: {{ selectedJob.postedAt | date:'mediumDate' }}
                        @if (selectedJob.expiresAt) {
                            &middot; <i class="pi pi-clock mr-1"></i>Expires: {{ selectedJob.expiresAt | date:'mediumDate' }}
                        }
                    </div>
                </div>
            }
        </p-dialog>

        <!-- Apply Dialog -->
        <p-dialog [(visible)]="showApplyDialog" [modal]="true" [style]="{ width: '500px' }" header="Apply for Job" [draggable]="false">
            @if (applyJob) {
                <div class="flex flex-column gap-4">
                    <div style="background:var(--p-primary-50);border-radius:0.75rem;padding:1rem;" class="flex align-items-center gap-3">
                        <i class="pi pi-briefcase text-primary text-xl"></i>
                        <div>
                            <div class="font-semibold text-surface-900">{{ applyJob.title }}</div>
                            <div class="text-surface-500 text-sm">{{ applyJob.company }}</div>
                        </div>
                    </div>
                    @if (applyError) {
                        <p-message severity="error" [text]="applyError"></p-message>
                    }
                    @if (applySuccess) {
                        <p-message severity="success" text="Application submitted successfully!"></p-message>
                    }
                    <div class="flex flex-column gap-1">
                        <label for="candidateId" class="text-surface-700 text-sm font-semibold">Your Candidate ID</label>
                        <input pInputText id="candidateId" [(ngModel)]="applyCandidateId" type="number" placeholder="Enter your candidate profile ID" class="w-full" />
                    </div>
                    <div class="flex flex-column gap-1">
                        <label for="coverLetter" class="text-surface-700 text-sm font-semibold">Cover Letter</label>
                        <textarea pTextarea id="coverLetter" [(ngModel)]="applyCoverLetter" [rows]="5" placeholder="Write a brief cover letter..." class="w-full"></textarea>
                    </div>
                    <div class="flex justify-content-end gap-2">
                        <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="showApplyDialog = false"></p-button>
                        <p-button label="Submit Application" icon="pi pi-send" [loading]="applyLoading" (onClick)="submitApplication()" [disabled]="applySuccess"></p-button>
                    </div>
                </div>
            }
        </p-dialog>
    `
})
export class JobList implements OnInit {
    private jobService = inject(JobService);
    private applicationService = inject(ApplicationService);
    authService = inject(AuthService);

    jobs: Job[] = [];
    loading = true;
    filters: JobFilters = {};

    selectedJob: Job | null = null;
    showDetailDialog = false;

    applyJob: Job | null = null;
    showApplyDialog = false;
    applyCandidateId: number | null = null;
    applyCoverLetter = '';
    applyLoading = false;
    applyError = '';
    applySuccess = false;

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.loading = true;
        this.jobService.getAll(this.filters).subscribe({
            next: (jobs) => { this.jobs = jobs; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    clearFilters() {
        this.filters = {};
        this.loadJobs();
    }

    viewJob(job: Job) {
        this.selectedJob = job;
        this.showDetailDialog = true;
    }

    openApplyDialog(job: Job) {
        this.applyJob = job;
        this.applyCoverLetter = '';
        this.applyCandidateId = null;
        this.applyError = '';
        this.applySuccess = false;
        this.showApplyDialog = true;
    }

    submitApplication() {
        if (!this.applyJob || !this.applyCandidateId) {
            this.applyError = 'Please enter your candidate ID.';
            return;
        }
        this.applyLoading = true;
        this.applyError = '';
        this.applicationService.create({
            jobId: this.applyJob.id,
            candidateId: this.applyCandidateId,
            coverLetter: this.applyCoverLetter
        }).subscribe({
            next: () => {
                this.applyLoading = false;
                this.applySuccess = true;
            },
            error: (err) => {
                this.applyLoading = false;
                this.applyError = err.error?.message || err.error || 'Failed to submit application.';
            }
        });
    }

    closeJob(job: Job) {
        this.jobService.close(job.id).subscribe({
            next: () => { job.status = 'Closed'; },
            error: () => {}
        });
    }

    formatSalary(min?: number, max?: number): string {
        const fmt = (n: number) => '$' + n.toLocaleString();
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        if (max) return `Up to ${fmt(max)}`;
        return 'N/A';
    }

    getJobTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const map: Record<string, any> = { 'FullTime': 'success', 'PartTime': 'info', 'Contract': 'warn', 'Remote': 'secondary' };
        return map[type] || 'info';
    }
}
