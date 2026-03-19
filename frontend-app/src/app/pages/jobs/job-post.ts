import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { CreateJobRequest, JobType } from '../../models/job.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-job-post',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, InputTextModule, TextareaModule, InputNumberModule, SelectModule, ButtonModule, MessageModule, ChipModule, DatePickerModule, SectionCard],
    template: `
        <section-card>
            <ng-template #title><i class="pi pi-plus"></i> Post a New Job</ng-template>
            <ng-template #description>Fill in the details to publish a job listing</ng-template>

        @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage" styleClass="w-full" [style]="{ display: 'block', 'margin-bottom': '1rem' }"></p-message>
        }
        @if (successMessage) {
            <p-message severity="success" [text]="successMessage" styleClass="w-full" [style]="{ display: 'block', 'margin-bottom': '1rem' }"></p-message>
        }

        <div class="form-section">
            <div class="form-section-title"><i class="pi pi-info-circle"></i> Basic Information</div>
            <div class="grid">
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="title">Job Title *</label>
                    <input pInputText id="title" [(ngModel)]="job.title" placeholder="e.g. Senior Software Engineer" class="w-full" />
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="company">Company *</label>
                    <input pInputText id="company" [(ngModel)]="job.company" placeholder="Company name" class="w-full" />
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="location">Location *</label>
                    <input pInputText id="location" [(ngModel)]="job.location" placeholder="e.g. New York, NY" class="w-full" />
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="type">Job Type *</label>
                    <p-select id="type" [(ngModel)]="job.type" [options]="jobTypes" optionLabel="label" optionValue="value" placeholder="Select type" styleClass="w-full"></p-select>
                </div>
            </div>
        </div>

        <div class="form-section">
            <div class="form-section-title"><i class="pi pi-dollar"></i> Compensation &amp; Experience</div>
            <div class="grid">
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="employerId">Employer ID *</label>
                    <p-inputNumber id="employerId" [(ngModel)]="job.employerId" placeholder="Your employer profile ID" [useGrouping]="false" styleClass="w-full"></p-inputNumber>
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="experience">Min Experience (years)</label>
                    <p-inputNumber id="experience" [(ngModel)]="job.minExperienceYears" [min]="0" [max]="30" styleClass="w-full"></p-inputNumber>
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="salaryMin">Salary Min</label>
                    <p-inputNumber id="salaryMin" [(ngModel)]="job.salaryMin" mode="currency" currency="USD" styleClass="w-full"></p-inputNumber>
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="salaryMax">Salary Max</label>
                    <p-inputNumber id="salaryMax" [(ngModel)]="job.salaryMax" mode="currency" currency="USD" styleClass="w-full"></p-inputNumber>
                </div>
                <div class="col-12 md:col-6 flex flex-column gap-1">
                    <label for="expiresAt">Expires At</label>
                    <p-datepicker id="expiresAt" [(ngModel)]="expiresDate" [minDate]="minDate" [showIcon]="true" styleClass="w-full"></p-datepicker>
                </div>
            </div>
        </div>

        <div class="form-section">
            <div class="form-section-title"><i class="pi pi-tag"></i> Skills &amp; Description</div>
            <div class="flex flex-column gap-1 mb-3">
                <label for="skills">Required Skills (press Enter to add)</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    @for (skill of skills; track skill; let i = $index) {
                        <p-chip [label]="skill" [removable]="true" (onRemove)="skills.splice(i, 1)"></p-chip>
                    }
                </div>
                <input pInputText id="skills" placeholder="Type skill and press Enter" class="w-full" (keydown.enter)="addSkill($event)" />
            </div>
            <div class="flex flex-column gap-1">
                <label for="description">Job Description *</label>
                <textarea pTextarea id="description" [(ngModel)]="job.description" [rows]="6" placeholder="Describe the role, responsibilities..." class="w-full"></textarea>
            </div>
        </div>

        <div class="flex justify-content-end gap-3 mt-3 pt-3 border-top-1 surface-border">
            <p-button label="Cancel" severity="secondary" [outlined]="true" routerLink="/jobs" icon="pi pi-times"></p-button>
            <p-button label="Post Job" icon="pi pi-check" [loading]="loading" (onClick)="onSubmit()"></p-button>
        </div>
        </section-card>
    `
})
export class JobPost {
    private jobService = inject(JobService);
    private router = inject(Router);

    job: Partial<CreateJobRequest> = { minExperienceYears: 0 };
    skills: string[] = [];
    expiresDate: Date | null = null;
    minDate = new Date();
    loading = false;
    errorMessage = '';
    successMessage = '';

    jobTypes = [
        { label: 'Full Time', value: 'FullTime' },
        { label: 'Part Time', value: 'PartTime' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Remote', value: 'Remote' }
    ];

    addSkill(event: Event) {
        const input = event.target as HTMLInputElement;
        const val = input.value.trim();
        if (val && !this.skills.includes(val)) {
            this.skills.push(val);
        }
        input.value = '';
        event.preventDefault();
    }

    onSubmit() {
        if (!this.job.title || !this.job.company || !this.job.location || !this.job.type || !this.job.description || !this.job.employerId) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }
        this.loading = true;
        this.errorMessage = '';

        const request: CreateJobRequest = {
            employerId: this.job.employerId!,
            title: this.job.title!,
            company: this.job.company!,
            location: this.job.location!,
            description: this.job.description!,
            requiredSkills: this.skills,
            minExperienceYears: this.job.minExperienceYears || 0,
            salaryMin: this.job.salaryMin,
            salaryMax: this.job.salaryMax,
            type: this.job.type as JobType,
            expiresAt: this.expiresDate?.toISOString()
        };

        this.jobService.create(request).subscribe({
            next: () => {
                this.successMessage = 'Job posted successfully!';
                setTimeout(() => this.router.navigate(['/jobs']), 1500);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Failed to post job.';
            }
        });
    }
}
