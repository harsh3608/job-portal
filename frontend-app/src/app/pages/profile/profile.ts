import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';
import { CandidateService } from '../../services/candidate.service';
import { EmployerService } from '../../services/employer.service';
import { Candidate, CreateCandidateRequest } from '../../models/candidate.models';
import { Employer, CreateEmployerRequest } from '../../models/employer.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, TextareaModule, ButtonModule, CardModule, ChipModule, TagModule, MessageModule, SectionCard],
    template: `
        <!-- Profile Header -->
        <section-card>
            <ng-template #title><i class="pi pi-user"></i> My Profile</ng-template>
            <ng-template #description>{{ authService.currentUser()?.email }} &middot; {{ authService.currentUser()?.role }}</ng-template>

        @if (message) {
            <p-message [severity]="messageType" [text]="message" styleClass="w-full" [style]="{ display: 'block', 'margin-bottom': '1rem' }"></p-message>
        }

        <!-- Candidate Section -->
        @if (authService.currentUser()?.role === 'Candidate') {
            @if (!candidateProfile && !showCreateForm) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-user-plus"></i></div>
                    <h3>No Candidate Profile</h3>
                    <p>You haven't created your candidate profile yet. Create one to start applying for jobs.</p>
                    <p-button label="Create Profile" icon="pi pi-plus" [style]="{ 'margin-top': '0.75rem' }" (onClick)="showCreateForm = true"></p-button>
                </div>
            }
            @if (candidateProfile && !editMode) {
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-user"></i> Personal Information</div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-id-card"></i> Full Name</span><span style="font-weight: 600;">{{ candidateProfile.fullName }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-envelope"></i> Email</span><span>{{ candidateProfile.email }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-phone"></i> Phone</span><span>{{ candidateProfile.phone || 'N/A' }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-star"></i> Experience</span><span style="font-weight: 600;">{{ candidateProfile.experienceYears }} years</span></div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-tag"></i> Skills</div>
                    <div class="flex flex-wrap gap-2 mb-3">
                        @for (skill of candidateProfile.skills; track skill) { <p-chip [label]="skill"></p-chip> }
                        @if (!candidateProfile.skills.length) { <span style="color: var(--p-surface-400);">No skills listed</span> }
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-align-left"></i> Summary</div>
                    <p style="color: var(--p-surface-700); white-space: pre-line; margin: 0;">{{ candidateProfile.summary || 'No summary provided.' }}</p>
                </div>
                <div class="flex justify-content-end">
                    <p-button label="Edit Profile" icon="pi pi-pencil" severity="warn" (onClick)="startEditCandidate()"></p-button>
                </div>
            }
            @if (showCreateForm || editMode) {
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-user"></i> Personal Information</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Full Name *</label>
                            <input pInputText [(ngModel)]="candidateForm.fullName" placeholder="Your full name" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Email *</label>
                            <input pInputText [(ngModel)]="candidateForm.email" placeholder="your@email.com" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Phone</label>
                            <input pInputText [(ngModel)]="candidateForm.phone" placeholder="+1 (555) 123-4567" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Experience (years)</label>
                            <p-inputNumber [(ngModel)]="candidateForm.experienceYears" [min]="0" styleClass="w-full"></p-inputNumber>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-tag"></i> Skills &amp; Summary</div>
                    <div class="flex flex-column gap-1 mb-3">
                        <label>Skills (press Enter to add)</label>
                        <div class="flex flex-wrap gap-2 mb-2">
                            @for (skill of candidateSkills; track skill; let i = $index) { <p-chip [label]="skill" [removable]="true" (onRemove)="candidateSkills.splice(i, 1)"></p-chip> }
                        </div>
                        <input pInputText placeholder="Type skill and press Enter" class="w-full" (keydown.enter)="addCandidateSkill($event)" />
                    </div>
                    <div class="flex flex-column gap-1">
                        <label>Summary</label>
                        <textarea pTextarea [(ngModel)]="candidateForm.summary" [rows]="4" placeholder="Brief professional summary..." class="w-full"></textarea>
                    </div>
                </div>
                <div class="flex justify-content-end gap-3 pt-3 border-top-1 surface-border">
                    <p-button label="Cancel" severity="secondary" [outlined]="true" icon="pi pi-times" (onClick)="cancelEdit()"></p-button>
                    <p-button [label]="editMode ? 'Update Profile' : 'Create Profile'" icon="pi pi-check" [loading]="saving" (onClick)="saveCandidate()"></p-button>
                </div>
            }
        }

        <!-- Employer Section -->
        @if (authService.currentUser()?.role === 'Employer') {
            @if (!employerProfile && !showCreateForm) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-building"></i></div>
                    <h3>No Employer Profile</h3>
                    <p>You haven't created your employer profile yet. Create one to start posting jobs.</p>
                    <p-button label="Create Profile" icon="pi pi-plus" [style]="{ 'margin-top': '0.75rem' }" (onClick)="showCreateForm = true"></p-button>
                </div>
            }
            @if (employerProfile && !editMode) {
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-building"></i> Company Information</div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-building"></i> Company</span><span style="font-weight: 600;">{{ employerProfile.companyName }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-briefcase"></i> Industry</span><span>{{ employerProfile.industry }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-globe"></i> Website</span>
                        @if (employerProfile.website) {
                            <a [href]="employerProfile.website" target="_blank" rel="noopener" style="color: var(--p-primary-color); font-weight: 500; text-decoration: none;">{{ employerProfile.website }}</a>
                        } @else { <span style="color: var(--p-surface-400);">N/A</span> }
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-phone"></i> Contact Details</div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-envelope"></i> Email</span><span>{{ employerProfile.contactEmail }}</span></div>
                    <div class="detail-row"><span class="detail-label"><i class="pi pi-phone"></i> Phone</span><span>{{ employerProfile.contactPhone || 'N/A' }}</span></div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-align-left"></i> Description</div>
                    <p style="color: var(--p-surface-700); white-space: pre-line; margin: 0;">{{ employerProfile.description || 'No description provided.' }}</p>
                </div>
                <div class="flex justify-content-end">
                    <p-button label="Edit Profile" icon="pi pi-pencil" severity="warn" (onClick)="startEditEmployer()"></p-button>
                </div>
            }
            @if (showCreateForm || editMode) {
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-building"></i> Company Information</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Company Name *</label>
                            <input pInputText [(ngModel)]="employerForm.companyName" placeholder="Company name" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Industry *</label>
                            <input pInputText [(ngModel)]="employerForm.industry" placeholder="e.g. Technology" class="w-full" />
                        </div>
                        <div class="col-12 flex flex-column gap-1">
                            <label>Website</label>
                            <input pInputText [(ngModel)]="employerForm.website" placeholder="https://..." class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-phone"></i> Contact Details</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Contact Email *</label>
                            <input pInputText [(ngModel)]="employerForm.contactEmail" placeholder="contact@company.com" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label>Contact Phone</label>
                            <input pInputText [(ngModel)]="employerForm.contactPhone" placeholder="+1 (555) 123-4567" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-align-left"></i> Description</div>
                    <div class="flex flex-column gap-1">
                        <label>Company Description</label>
                        <textarea pTextarea [(ngModel)]="employerForm.description" [rows]="4" placeholder="Describe your company..." class="w-full"></textarea>
                    </div>
                </div>
                <div class="flex justify-content-end gap-3 pt-3 border-top-1 surface-border">
                    <p-button label="Cancel" severity="secondary" [outlined]="true" icon="pi pi-times" (onClick)="cancelEdit()"></p-button>
                    <p-button [label]="editMode ? 'Update Profile' : 'Create Profile'" icon="pi pi-check" [loading]="saving" (onClick)="saveEmployer()"></p-button>
                </div>
            }
        }

        </section-card>

        <!-- Account Actions -->
        <section-card>
            <ng-template #title><i class="pi pi-cog"></i> Account Actions</ng-template>
            <div class="flex align-items-center justify-content-between">
                <div>
                    <p style="color: var(--p-surface-700); font-weight: 500; margin: 0;">Sign Out</p>
                    <p style="color: var(--p-surface-400); font-size: 0.8125rem; margin: 0.125rem 0 0;">Log out of your account on this device</p>
                </div>
                <p-button label="Logout" icon="pi pi-sign-out" severity="danger" [outlined]="true" (onClick)="authService.logout()"></p-button>
            </div>
        </section-card>
    `
})
export class Profile implements OnInit {
    authService = inject(AuthService);
    private candidateService = inject(CandidateService);
    private employerService = inject(EmployerService);

    candidateProfile: Candidate | null = null;
    employerProfile: Employer | null = null;
    showCreateForm = false;
    editMode = false;
    saving = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    candidateForm: CreateCandidateRequest = { fullName: '', email: '', phone: '', summary: '', skills: [], experienceYears: 0 };
    candidateSkills: string[] = [];
    employerForm: CreateEmployerRequest = { companyName: '', industry: '', website: '', contactEmail: '', contactPhone: '', description: '' };

    ngOnInit() {
        const user = this.authService.currentUser();
        if (!user) return;

        if (user.role === 'Candidate') {
            this.candidateService.getAll().subscribe({
                next: (list) => {
                    this.candidateProfile = list.find(c => c.email === user.email) || null;
                },
                error: () => {}
            });
        } else if (user.role === 'Employer') {
            this.employerService.getAll().subscribe({
                next: (list) => {
                    this.employerProfile = list.find(e => e.contactEmail === user.email) || null;
                },
                error: () => {}
            });
        }
    }

    startEditCandidate() {
        if (!this.candidateProfile) return;
        this.editMode = true;
        this.candidateForm = {
            fullName: this.candidateProfile.fullName, email: this.candidateProfile.email,
            phone: this.candidateProfile.phone, summary: this.candidateProfile.summary,
            skills: [...this.candidateProfile.skills], experienceYears: this.candidateProfile.experienceYears
        };
        this.candidateSkills = [...this.candidateProfile.skills];
    }

    addCandidateSkill(event: Event) {
        const input = event.target as HTMLInputElement;
        const val = input.value.trim();
        if (val && !this.candidateSkills.includes(val)) {
            this.candidateSkills.push(val);
        }
        input.value = '';
        event.preventDefault();
    }

    startEditEmployer() {
        if (!this.employerProfile) return;
        this.editMode = true;
        this.employerForm = {
            companyName: this.employerProfile.companyName, industry: this.employerProfile.industry,
            website: this.employerProfile.website, contactEmail: this.employerProfile.contactEmail,
            contactPhone: this.employerProfile.contactPhone, description: this.employerProfile.description
        };
    }

    cancelEdit() {
        this.editMode = false;
        this.showCreateForm = false;
    }

    saveCandidate() {
        this.candidateForm.skills = this.candidateSkills;
        if (!this.candidateForm.fullName || !this.candidateForm.email) {
            this.message = 'Name and email are required.'; this.messageType = 'error'; return;
        }
        this.saving = true;
        this.message = '';
        const obs = this.editMode && this.candidateProfile
            ? this.candidateService.update(this.candidateProfile.id, this.candidateForm)
            : this.candidateService.create(this.candidateForm);
        obs.subscribe({
            next: (c) => {
                this.candidateProfile = c;
                this.editMode = false;
                this.showCreateForm = false;
                this.saving = false;
                this.message = 'Profile saved successfully!';
                this.messageType = 'success';
            },
            error: (err) => {
                this.saving = false;
                this.message = err.error?.message || 'Failed to save profile.';
                this.messageType = 'error';
            }
        });
    }

    saveEmployer() {
        if (!this.employerForm.companyName || !this.employerForm.contactEmail) {
            this.message = 'Company name and contact email are required.'; this.messageType = 'error'; return;
        }
        this.saving = true;
        this.message = '';
        const obs = this.editMode && this.employerProfile
            ? this.employerService.update(this.employerProfile.id, this.employerForm)
            : this.employerService.create(this.employerForm);
        obs.subscribe({
            next: (e) => {
                this.employerProfile = e;
                this.editMode = false;
                this.showCreateForm = false;
                this.saving = false;
                this.message = 'Profile saved successfully!';
                this.messageType = 'success';
            },
            error: (err) => {
                this.saving = false;
                this.message = err.error?.message || 'Failed to save profile.';
                this.messageType = 'error';
            }
        });
    }
}
