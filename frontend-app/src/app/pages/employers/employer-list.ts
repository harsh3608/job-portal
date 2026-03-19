import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { EmployerService } from '../../services/employer.service';
import { Employer, CreateEmployerRequest } from '../../models/employer.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-employer-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, ProgressSpinnerModule, MessageModule, ConfirmDialogModule, TagModule, SectionCard],
    providers: [ConfirmationService],
    template: `
        <section-card>
            <ng-template #title><i class="pi pi-building"></i> Employers</ng-template>
            <ng-template #description>Manage company profiles and partnerships</ng-template>
            <ng-template #action>
                <div class="flex align-items-center gap-3">
                    <span class="result-badge">{{ employers.length }} companies</span>
                    <p-button label="Add Employer" icon="pi pi-plus" (onClick)="openCreateDialog()"></p-button>
                </div>
            </ng-template>

            @if (loading) {
                <div class="flex justify-content-center p-6"><p-progressSpinner></p-progressSpinner></div>
            } @else if (employers.length === 0) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-building"></i></div>
                    <h3>No Employers Found</h3>
                    <p>Register your first employer to get started.</p>
                    <p-button label="Add Employer" icon="pi pi-plus" class="mt-3" (onClick)="openCreateDialog()"></p-button>
                </div>
            } @else {
                <p-table [value]="employers" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]"
                         [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employers"
                         styleClass="p-datatable-striped">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="companyName">Company <p-sortIcon field="companyName" /></th>
                            <th pSortableColumn="industry">Industry <p-sortIcon field="industry" /></th>
                            <th>Website</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-employer>
                        <tr>
                            <td>
                                <div class="flex align-items-center gap-3">
                                    <div style="width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 700;">{{ employer.companyName?.charAt(0) || '?' }}</div>
                                    <span class="font-semibold text-surface-900">{{ employer.companyName }}</span>
                                </div>
                            </td>
                            <td><p-tag [value]="employer.industry" severity="secondary"></p-tag></td>
                            <td>
                                @if (employer.website) {
                                    <a [href]="employer.website" target="_blank" rel="noopener" class="text-primary font-medium no-underline hover:underline"><i class="pi pi-external-link text-xs mr-1"></i>Website</a>
                                } @else {
                                    <span class="text-surface-400">—</span>
                                }
                            </td>
                            <td>
                                <div class="flex flex-column">
                                    <span class="text-surface-700 text-sm">{{ employer.contactEmail }}</span>
                                    <span class="text-surface-400 text-xs">{{ employer.contactPhone || '' }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex gap-1">
                                    <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="info" pTooltip="View" (onClick)="viewEmployer(employer)"></p-button>
                                    <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="warn" pTooltip="Edit" (onClick)="openEditDialog(employer)"></p-button>
                                    <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" pTooltip="Delete" (onClick)="deleteEmployer(employer)"></p-button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            }
        </section-card>

        <p-confirmDialog></p-confirmDialog>

        <!-- View Dialog -->
        <p-dialog [(visible)]="showViewDialog" [modal]="true" [style]="{ width: '560px' }" [draggable]="false" [header]="selectedEmployer?.companyName || 'Employer'">
            @if (selectedEmployer) {
                <div class="flex flex-column gap-1">
                    <div class="flex align-items-center gap-3 mb-3" style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); border-radius: 12px; padding: 1.5rem; color: white;">
                        <div style="width: 56px; height: 56px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700;">{{ selectedEmployer.companyName.charAt(0) || '?' }}</div>
                        <div>
                            <div class="text-xl font-bold">{{ selectedEmployer.companyName }}</div>
                            <div class="text-sm opacity-80">{{ selectedEmployer.industry }}</div>
                        </div>
                    </div>
                    <div class="detail-row"><span class="text-surface-500"><i class="pi pi-globe mr-2"></i>Website</span>
                        @if (selectedEmployer.website) {
                            <a [href]="selectedEmployer.website" target="_blank" rel="noopener" class="text-primary font-medium no-underline hover:underline">{{ selectedEmployer.website }}</a>
                        } @else { <span class="text-surface-400">N/A</span> }
                    </div>
                    <div class="detail-row"><span class="text-surface-500"><i class="pi pi-envelope mr-2"></i>Email</span><span>{{ selectedEmployer.contactEmail }}</span></div>
                    <div class="detail-row"><span class="text-surface-500"><i class="pi pi-phone mr-2"></i>Phone</span><span>{{ selectedEmployer.contactPhone || 'N/A' }}</span></div>
                    <div class="mt-3">
                        <div class="text-surface-500 text-sm font-semibold mb-2"><i class="pi pi-align-left mr-1"></i>Description</div>
                        <div style="background: var(--p-surface-50); border-radius: 8px; padding: 1rem; border: 1px solid var(--p-surface-200);">
                            <p class="text-surface-700 whitespace-pre-line m-0">{{ selectedEmployer.description || 'No description provided.' }}</p>
                        </div>
                    </div>
                    <div class="text-surface-400 text-xs mt-3"><i class="pi pi-calendar mr-1"></i>Joined: {{ selectedEmployer.createdAt | date:'mediumDate' }}</div>
                </div>
            }
        </p-dialog>

        <!-- Create/Edit Dialog -->
        <p-dialog [(visible)]="showFormDialog" [modal]="true" [style]="{ width: '560px' }" [draggable]="false" [header]="isEditing ? 'Edit Employer' : 'Add Employer'">
            <div class="flex flex-column gap-4">
                @if (formError) {
                    <p-message severity="error" [text]="formError"></p-message>
                }
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-building"></i> Company Information</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Company Name *</label>
                            <input pInputText [(ngModel)]="formData.companyName" placeholder="Company name" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Industry *</label>
                            <input pInputText [(ngModel)]="formData.industry" placeholder="e.g. Technology" class="w-full" />
                        </div>
                        <div class="col-12 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Website</label>
                            <input pInputText [(ngModel)]="formData.website" placeholder="https://..." class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title"><i class="pi pi-phone"></i> Contact Details</div>
                    <div class="grid">
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Contact Email *</label>
                            <input pInputText [(ngModel)]="formData.contactEmail" placeholder="Contact email" class="w-full" />
                        </div>
                        <div class="col-12 md:col-6 flex flex-column gap-1">
                            <label class="text-surface-700 text-sm font-semibold">Contact Phone</label>
                            <input pInputText [(ngModel)]="formData.contactPhone" placeholder="Phone" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-1">
                    <label class="text-surface-700 text-sm font-semibold">Description</label>
                    <textarea pTextarea [(ngModel)]="formData.description" [rows]="4" placeholder="Company description..." class="w-full"></textarea>
                </div>
                <div class="flex justify-content-end gap-2 pt-3 border-top-1 surface-border">
                    <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="showFormDialog = false"></p-button>
                    <p-button [label]="isEditing ? 'Update' : 'Create'" icon="pi pi-check" [loading]="formLoading" (onClick)="saveEmployer()"></p-button>
                </div>
            </div>
        </p-dialog>
    `
})
export class EmployerList implements OnInit {
    private employerService = inject(EmployerService);
    private confirmService = inject(ConfirmationService);

    employers: Employer[] = [];
    loading = true;

    selectedEmployer: Employer | null = null;
    showViewDialog = false;

    showFormDialog = false;
    isEditing = false;
    editingId = 0;
    formData: CreateEmployerRequest = { companyName: '', industry: '', website: '', contactEmail: '', contactPhone: '', description: '' };
    formLoading = false;
    formError = '';

    ngOnInit() {
        this.loadEmployers();
    }

    loadEmployers() {
        this.loading = true;
        this.employerService.getAll().subscribe({
            next: (data) => { this.employers = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewEmployer(e: Employer) {
        this.selectedEmployer = e;
        this.showViewDialog = true;
    }

    openCreateDialog() {
        this.isEditing = false;
        this.formData = { companyName: '', industry: '', website: '', contactEmail: '', contactPhone: '', description: '' };
        this.formError = '';
        this.showFormDialog = true;
    }

    openEditDialog(e: Employer) {
        this.isEditing = true;
        this.editingId = e.id;
        this.formData = {
            companyName: e.companyName, industry: e.industry, website: e.website,
            contactEmail: e.contactEmail, contactPhone: e.contactPhone, description: e.description
        };
        this.formError = '';
        this.showFormDialog = true;
    }

    saveEmployer() {
        if (!this.formData.companyName || !this.formData.industry || !this.formData.contactEmail) {
            this.formError = 'Company name, industry, and contact email are required.';
            return;
        }
        this.formLoading = true;
        this.formError = '';

        const obs = this.isEditing
            ? this.employerService.update(this.editingId, this.formData)
            : this.employerService.create(this.formData);

        obs.subscribe({
            next: () => { this.formLoading = false; this.showFormDialog = false; this.loadEmployers(); },
            error: (err) => { this.formLoading = false; this.formError = err.error?.message || 'Operation failed.'; }
        });
    }

    deleteEmployer(e: Employer) {
        this.confirmService.confirm({
            message: `Delete employer "${e.companyName}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employerService.delete(e.id).subscribe({
                    next: () => this.loadEmployers(),
                    error: () => {}
                });
            }
        });
    }
}
