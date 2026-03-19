import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CandidateService } from '../../services/candidate.service';
import { Candidate, CreateCandidateRequest } from '../../models/candidate.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-candidate-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, InputNumberModule, TextareaModule, ChipModule, ProgressSpinnerModule, MessageModule, ConfirmDialogModule, SectionCard],
    providers: [ConfirmationService],
    template: `
        <section-card>
            <ng-template #title><i class="pi pi-users"></i> Candidates</ng-template>
            <ng-template #description>Manage candidate profiles and skills</ng-template>
            <ng-template #action>
                <div class="flex align-items-center gap-3">
                    <span class="result-badge">{{ candidates.length }} candidates</span>
                    <p-button label="Add Candidate" icon="pi pi-plus" (onClick)="openCreateDialog()"></p-button>
                </div>
            </ng-template>

            @if (loading) {
                <div class="flex justify-content-center p-6"><p-progressSpinner></p-progressSpinner></div>
            } @else if (candidates.length === 0) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-users"></i></div>
                    <h3>No Candidates Found</h3>
                    <p>Add your first candidate to get started.</p>
                    <p-button label="Add Candidate" icon="pi pi-plus" class="mt-3" (onClick)="openCreateDialog()"></p-button>
                </div>
            } @else {
                <p-table [value]="candidates" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]"
                         [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} candidates"
                         styleClass="p-datatable-striped">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="fullName">Candidate <p-sortIcon field="fullName" /></th>
                            <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
                            <th>Phone</th>
                            <th>Skills</th>
                            <th pSortableColumn="experienceYears">Experience <p-sortIcon field="experienceYears" /></th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-candidate>
                        <tr>
                            <td>
                                <div class="flex align-items-center gap-3">
                                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 600;">{{ candidate.fullName?.charAt(0) || '?' }}</div>
                                    <span class="font-semibold text-surface-900">{{ candidate.fullName }}</span>
                                </div>
                            </td>
                            <td><span class="text-surface-600">{{ candidate.email }}</span></td>
                            <td><span class="text-surface-600">{{ candidate.phone || '—' }}</span></td>
                            <td>
                                <div class="flex flex-wrap gap-1">
                                    @for (skill of candidate.skills?.slice(0, 3); track skill) {
                                        <p-chip [label]="skill" styleClass="text-xs"></p-chip>
                                    }
                                    @if (candidate.skills?.length > 3) {
                                        <span class="text-xs font-semibold text-primary self-center">+{{ candidate.skills.length - 3 }} more</span>
                                    }
                                </div>
                            </td>
                            <td>
                                <div class="flex align-items-center gap-1">
                                    <i class="pi pi-star-fill text-yellow-500 text-xs"></i>
                                    <span class="font-medium">{{ candidate.experienceYears }} yrs</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex gap-1">
                                    <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="info" pTooltip="View" (onClick)="viewCandidate(candidate)"></p-button>
                                    <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="warn" pTooltip="Edit" (onClick)="openEditDialog(candidate)"></p-button>
                                    <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" pTooltip="Delete" (onClick)="deleteCandidate(candidate)"></p-button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            }
        </section-card>

        <p-confirmDialog></p-confirmDialog>

        <!-- View Dialog -->
        <p-dialog [(visible)]="showViewDialog" [modal]="true" [style]="{ width: '560px' }" [draggable]="false" [header]="selectedCandidate?.fullName || 'Candidate'">
            @if (selectedCandidate) {
                <div class="flex flex-column gap-1">
                    <div class="flex align-items-center gap-3 mb-3" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 1.5rem; color: white;">
                        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700;">{{ selectedCandidate.fullName.charAt(0) || '?' }}</div>
                        <div>
                            <div class="text-xl font-bold">{{ selectedCandidate.fullName }}</div>
                            <div class="text-sm opacity-80">{{ selectedCandidate.experienceYears }} years experience</div>
                        </div>
                    </div>
                    <div class="detail-row"><span class="text-surface-500"><i class="pi pi-envelope mr-2"></i>Email</span><span>{{ selectedCandidate.email }}</span></div>
                    <div class="detail-row"><span class="text-surface-500"><i class="pi pi-phone mr-2"></i>Phone</span><span>{{ selectedCandidate.phone || 'N/A' }}</span></div>
                    <div class="mt-3">
                        <div class="text-surface-500 text-sm font-semibold mb-2"><i class="pi pi-tag mr-1"></i>Skills</div>
                        <div class="flex flex-wrap gap-2">
                            @for (skill of selectedCandidate.skills; track skill) { <p-chip [label]="skill"></p-chip> }
                            @if (!selectedCandidate.skills.length) { <span class="text-surface-400">No skills listed</span> }
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-surface-500 text-sm font-semibold mb-2"><i class="pi pi-align-left mr-1"></i>Summary</div>
                        <div style="background: var(--p-surface-50); border-radius: 8px; padding: 1rem; border: 1px solid var(--p-surface-200);">
                            <p class="text-surface-700 whitespace-pre-line m-0">{{ selectedCandidate.summary || 'No summary provided.' }}</p>
                        </div>
                    </div>
                    @if (selectedCandidate.resumeUrl) {
                        <div class="detail-row mt-2"><span class="text-surface-500"><i class="pi pi-file mr-2"></i>Resume</span><a [href]="selectedCandidate.resumeUrl" target="_blank" class="text-primary font-medium no-underline hover:underline">View Resume <i class="pi pi-external-link text-xs"></i></a></div>
                    }
                    <div class="text-surface-400 text-xs mt-3"><i class="pi pi-calendar mr-1"></i>Joined: {{ selectedCandidate.createdAt | date:'mediumDate' }}</div>
                </div>
            }
        </p-dialog>

        <!-- Create/Edit Dialog -->
        <p-dialog [(visible)]="showFormDialog" [modal]="true" [style]="{ width: '560px' }" [draggable]="false" [header]="isEditing ? 'Edit Candidate' : 'Add Candidate'">
            <div class="flex flex-column gap-4">
                @if (formError) {
                    <p-message severity="error" [text]="formError"></p-message>
                }
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-user"></i> Personal Information</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Full Name *</label>
                            <input pInputText [(ngModel)]="formData.fullName" placeholder="Full name" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Email *</label>
                            <input pInputText [(ngModel)]="formData.email" placeholder="Email" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Phone</label>
                            <input pInputText [(ngModel)]="formData.phone" placeholder="Phone" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Experience (years)</label>
                            <p-inputNumber [(ngModel)]="formData.experienceYears" [min]="0" [max]="50" styleClass="w-full"></p-inputNumber>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-tag"></i> Skills & Summary</div>
                    <div class="flex flex-column gap-4">
                        <div class="flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Skills</label>
                            <div class="flex flex-wrap gap-2 mb-2">@for (skill of formSkills; track skill; let i = $index) { <p-chip [label]="skill" [removable]="true" (onRemove)="formSkills.splice(i, 1)"></p-chip> }</div>
                            <input pInputText placeholder="Type skill and press Enter" class="w-full" (keydown.enter)="addFormSkill($event)" />
                        </div>
                        <div class="flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Summary</label>
                            <textarea pTextarea [(ngModel)]="formData.summary" [rows]="4" placeholder="Brief summary..." class="w-full"></textarea>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2 pt-3 border-top-1 surface-border">
                    <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="showFormDialog = false"></p-button>
                    <p-button [label]="isEditing ? 'Update' : 'Create'" icon="pi pi-check" [loading]="formLoading" (onClick)="saveCandidate()"></p-button>
                </div>
            </div>
        </p-dialog>
    `
})
export class CandidateList implements OnInit {
    private candidateService = inject(CandidateService);
    private confirmService = inject(ConfirmationService);

    candidates: Candidate[] = [];
    loading = true;

    selectedCandidate: Candidate | null = null;
    showViewDialog = false;

    showFormDialog = false;
    isEditing = false;
    editingId = 0;
    formData: CreateCandidateRequest = { fullName: '', email: '', phone: '', summary: '', skills: [], experienceYears: 0 };
    formSkills: string[] = [];
    formLoading = false;
    formError = '';

    ngOnInit() {
        this.loadCandidates();
    }

    loadCandidates() {
        this.loading = true;
        this.candidateService.getAll().subscribe({
            next: (data) => { this.candidates = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewCandidate(c: Candidate) {
        this.selectedCandidate = c;
        this.showViewDialog = true;
    }

    openCreateDialog() {
        this.isEditing = false;
        this.formData = { fullName: '', email: '', phone: '', summary: '', skills: [], experienceYears: 0 };
        this.formSkills = [];
        this.formError = '';
        this.showFormDialog = true;
    }

    openEditDialog(c: Candidate) {
        this.isEditing = true;
        this.editingId = c.id;
        this.formData = { fullName: c.fullName, email: c.email, phone: c.phone, summary: c.summary, skills: [...c.skills], experienceYears: c.experienceYears };
        this.formSkills = [...c.skills];
        this.formError = '';
        this.showFormDialog = true;
    }

    addFormSkill(event: Event) {
        const input = event.target as HTMLInputElement;
        const val = input.value.trim();
        if (val && !this.formSkills.includes(val)) {
            this.formSkills.push(val);
        }
        input.value = '';
        event.preventDefault();
    }

    saveCandidate() {
        if (!this.formData.fullName || !this.formData.email) {
            this.formError = 'Name and email are required.';
            return;
        }
        this.formLoading = true;
        this.formError = '';
        this.formData.skills = this.formSkills;

        const obs = this.isEditing
            ? this.candidateService.update(this.editingId, this.formData)
            : this.candidateService.create(this.formData);

        obs.subscribe({
            next: () => { this.formLoading = false; this.showFormDialog = false; this.loadCandidates(); },
            error: (err) => { this.formLoading = false; this.formError = err.error?.message || 'Operation failed.'; }
        });
    }

    deleteCandidate(c: Candidate) {
        this.confirmService.confirm({
            message: `Delete candidate "${c.fullName}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.candidateService.delete(c.id).subscribe({
                    next: () => this.loadCandidates(),
                    error: () => {}
                });
            }
        });
    }
}
