import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobApplication, ApplicationStatus } from '../../models/application.models';
import { SectionCard } from '../../layout/components/ui/sectioncard';

@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, SelectModule, ProgressSpinnerModule, MessageModule, SectionCard],
    template: `
        <section-card>
            <ng-template #title><i class="pi pi-file-edit"></i> Applications</ng-template>
            <ng-template #description>Track and manage all job applications</ng-template>
            <ng-template #action>
                <div class="flex align-items-center gap-3">
                    <span class="result-badge">{{ applications.length }} total</span>
                    <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="loadApplications()"></p-button>
                </div>
            </ng-template>

            @if (loading) {
                <div class="flex justify-content-center p-6"><p-progressSpinner></p-progressSpinner></div>
            } @else if (applications.length === 0) {
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="pi pi-inbox"></i></div>
                    <h3>No Applications Yet</h3>
                    <p>Applications will appear here once candidates start applying.</p>
                </div>
            } @else {
                <p-table [value]="applications" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25]"
                         [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} applications"
                         styleClass="p-datatable-striped" [globalFilterFields]="['status', 'jobId']">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                            <th pSortableColumn="jobId">Job ID <p-sortIcon field="jobId" /></th>
                            <th pSortableColumn="candidateId">Candidate <p-sortIcon field="candidateId" /></th>
                            <th>Cover Letter</th>
                            <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
                            <th pSortableColumn="appliedAt">Applied <p-sortIcon field="appliedAt" /></th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-app>
                        <tr>
                            <td><span class="text-surface-500">#{{ app.id }}</span></td>
                            <td><span class="font-semibold text-primary">Job #{{ app.jobId }}</span></td>
                            <td>
                                <div class="flex align-items-center gap-2">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">C{{ app.candidateId }}</div>
                                    <span class="font-medium">Candidate #{{ app.candidateId }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="text-surface-600 text-sm">
                                    {{ app.coverLetter ? (app.coverLetter.length > 50 ? (app.coverLetter | slice:0:50) + '...' : app.coverLetter) : '—' }}
                                </span>
                            </td>
                            <td><p-tag [value]="app.status" [severity]="getStatusSeverity(app.status)"></p-tag></td>
                            <td><span class="text-surface-600 text-sm"><i class="pi pi-calendar mr-1"></i>{{ app.appliedAt | date:'mediumDate' }}</span></td>
                            <td>
                                <div class="flex gap-1">
                                    <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="info" pTooltip="View Details" (onClick)="viewApplication(app)"></p-button>
                                    @if (authService.currentUser()?.role === 'Employer') {
                                        <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="warn" pTooltip="Update Status" (onClick)="openStatusDialog(app)"></p-button>
                                    }
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            }
        </section-card>

        <!-- Detail Dialog -->
        <p-dialog [(visible)]="showDetailDialog" [modal]="true" [style]="{ width: '520px' }" [draggable]="false" header="Application Details">
            @if (selectedApp) {
                <div class="flex flex-column gap-1">
                    <div class="flex align-items-center justify-content-between" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; color: white;">
                            <div>
                                <div class="text-sm opacity-80">Application</div>
                                <div class="text-xl font-bold">#{{ selectedApp.id }}</div>
                            </div>
                            <p-tag [value]="selectedApp.status" [severity]="getStatusSeverity(selectedApp.status)"></p-tag>
                        </div>
                    <div class="detail-row"><span class="text-surface-500">Job ID</span><span class="font-semibold">#{{ selectedApp.jobId }}</span></div>
                    <div class="detail-row"><span class="text-surface-500">Candidate ID</span><span class="font-semibold">#{{ selectedApp.candidateId }}</span></div>
                    <div class="detail-row"><span class="text-surface-500">Applied</span><span>{{ selectedApp.appliedAt | date:'medium' }}</span></div>
                    @if (selectedApp.updatedAt) {
                        <div class="detail-row"><span class="text-surface-500">Updated</span><span>{{ selectedApp.updatedAt | date:'medium' }}</span></div>
                    }
                    <div class="mt-3">
                        <div class="text-surface-500 text-sm font-semibold mb-2"><i class="pi pi-file mr-1"></i>Cover Letter</div>
                        <div style="background: var(--p-surface-50); border-radius: 8px; padding: 1rem; border: 1px solid var(--p-surface-200);">
                            <p class="text-surface-700 whitespace-pre-line m-0">{{ selectedApp.coverLetter || 'No cover letter provided.' }}</p>
                        </div>
                    </div>
                </div>
            }
        </p-dialog>

        <!-- Update Status Dialog -->
        <p-dialog [(visible)]="showStatusDialog" [modal]="true" [style]="{ width: '420px' }" [draggable]="false" header="Update Status">
            @if (statusApp) {
                <div class="flex flex-column gap-4">
                    <div style="background: var(--p-surface-50); border-radius: 8px; padding: 1rem; border-left: 4px solid var(--p-primary-color);">
                        <span class="text-surface-600">Updating status for</span>
                        <span class="font-bold ml-1">Application #{{ statusApp.id }}</span>
                    </div>
                    @if (statusError) {
                        <p-message severity="error" [text]="statusError"></p-message>
                    }
                    <div class="flex flex-column gap-1">
                        <label class="text-surface-700 text-sm font-semibold">New Status</label>
                        <p-select [(ngModel)]="newStatus" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" styleClass="w-full"></p-select>
                    </div>
                    <div class="flex justify-content-end gap-2 pt-2 border-top-1 surface-border">
                        <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="showStatusDialog = false"></p-button>
                        <p-button label="Update Status" icon="pi pi-check" [loading]="statusLoading" (onClick)="updateStatus()"></p-button>
                    </div>
                </div>
            }
        </p-dialog>
    `
})
export class ApplicationList implements OnInit {
    private applicationService = inject(ApplicationService);
    authService = inject(AuthService);

    applications: JobApplication[] = [];
    loading = true;

    selectedApp: JobApplication | null = null;
    showDetailDialog = false;

    statusApp: JobApplication | null = null;
    showStatusDialog = false;
    newStatus: ApplicationStatus = 'Reviewed';
    statusLoading = false;
    statusError = '';

    statusOptions = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Reviewed', value: 'Reviewed' },
        { label: 'Shortlisted', value: 'Shortlisted' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Hired', value: 'Hired' }
    ];

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        this.loading = true;
        this.applicationService.getAll().subscribe({
            next: (apps) => { this.applications = apps; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewApplication(app: JobApplication) {
        this.selectedApp = app;
        this.showDetailDialog = true;
    }

    openStatusDialog(app: JobApplication) {
        this.statusApp = app;
        this.newStatus = app.status;
        this.statusError = '';
        this.showStatusDialog = true;
    }

    updateStatus() {
        if (!this.statusApp) return;
        this.statusLoading = true;
        this.statusError = '';
        this.applicationService.updateStatus(this.statusApp.id, { status: this.newStatus }).subscribe({
            next: (updated) => {
                this.statusLoading = false;
                this.showStatusDialog = false;
                const idx = this.applications.findIndex(a => a.id === this.statusApp!.id);
                if (idx >= 0) this.applications[idx].status = this.newStatus;
            },
            error: (err) => {
                this.statusLoading = false;
                this.statusError = err.error?.message || 'Failed to update status.';
            }
        });
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const map: Record<string, any> = {
            'Pending': 'warn', 'Reviewed': 'info', 'Shortlisted': 'success', 'Rejected': 'danger', 'Hired': 'success'
        };
        return map[status] || 'info';
    }
}
