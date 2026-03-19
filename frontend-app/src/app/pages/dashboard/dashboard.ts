import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { SectionCard } from '../../layout/components/ui/sectioncard';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { CandidateService } from '../../services/candidate.service';
import { EmployerService } from '../../services/employer.service';
import { Job } from '../../models/job.models';
import { JobApplication } from '../../models/application.models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, AvatarModule, DividerModule, TooltipModule, ProgressBarModule, SectionCard],
    template: `
        <!-- ═══════════════════════════════════════════════════ -->
        <!-- HERO WELCOME BANNER                                 -->
        <!-- ═══════════════════════════════════════════════════ -->
        <div class="db-hero animate-fade-in">
            <div class="db-hero__blob db-hero__blob--1"></div>
            <div class="db-hero__blob db-hero__blob--2"></div>
            <div class="db-hero__blob db-hero__blob--3"></div>
            <div class="db-hero__content">
                <div class="db-hero__left">
                    <div class="db-hero__avatar">
                        {{ getUserInitials() }}
                    </div>
                    <div class="db-hero__text">
                        <div class="db-hero__greeting">Good {{ getTimeOfDay() }}, 👋</div>
                        <h1 class="db-hero__name">{{ getUserDisplayName() }}</h1>
                        <div class="db-hero__meta">
                            <span class="db-hero__role-badge">
                                <i class="pi pi-shield"></i>
                                {{ authService.currentUser()?.role || 'User' }}
                            </span>
                            <span class="db-hero__date">
                                <i class="pi pi-calendar"></i>
                                {{ today | date:'EEEE, MMMM d' }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="db-hero__right">
                    <div class="db-hero__stat-mini">
                        <span class="db-hero__stat-mini-value">{{ stats.totalJobs }}</span>
                        <span class="db-hero__stat-mini-label">Active Jobs</span>
                    </div>
                    <div class="db-hero__stat-divider"></div>
                    <div class="db-hero__stat-mini">
                        <span class="db-hero__stat-mini-value">{{ stats.totalApplications }}</span>
                        <span class="db-hero__stat-mini-label">Applications</span>
                    </div>
                    <div class="db-hero__stat-divider"></div>
                    <div class="db-hero__stat-mini">
                        <span class="db-hero__stat-mini-value">{{ stats.totalCandidates }}</span>
                        <span class="db-hero__stat-mini-label">Candidates</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- KPI STAT CARDS                                      -->
        <!-- ═══════════════════════════════════════════════════ -->
        <div class="db-kpi-grid animate-fade-in">
            <div class="db-kpi db-kpi--indigo">
                <div class="db-kpi__header">
                    <div class="db-kpi__icon-wrap">
                        <i class="pi pi-briefcase"></i>
                    </div>
                    <span class="db-kpi__trend db-kpi__trend--up">
                        <i class="pi pi-arrow-up-right"></i> Live
                    </span>
                </div>
                <div class="db-kpi__value">{{ stats.totalJobs }}</div>
                <div class="db-kpi__label">Total Jobs Posted</div>
                <div class="db-kpi__bar-track">
                    <div class="db-kpi__bar-fill" [style.width]="stats.totalJobs > 0 ? '100%' : '8%'"></div>
                </div>
            </div>

            <div class="db-kpi db-kpi--emerald">
                <div class="db-kpi__header">
                    <div class="db-kpi__icon-wrap">
                        <i class="pi pi-send"></i>
                    </div>
                    <span class="db-kpi__trend db-kpi__trend--up">
                        <i class="pi pi-arrow-up-right"></i> Active
                    </span>
                </div>
                <div class="db-kpi__value">{{ stats.totalApplications }}</div>
                <div class="db-kpi__label">Total Applications</div>
                <div class="db-kpi__bar-track">
                    <div class="db-kpi__bar-fill" [style.width]="stats.totalApplications > 0 ? '100%' : '8%'"></div>
                </div>
            </div>

            <div class="db-kpi db-kpi--amber">
                <div class="db-kpi__header">
                    <div class="db-kpi__icon-wrap">
                        <i class="pi pi-users"></i>
                    </div>
                    <span class="db-kpi__trend db-kpi__trend--neutral">
                        <i class="pi pi-minus"></i> Total
                    </span>
                </div>
                <div class="db-kpi__value">{{ stats.totalCandidates }}</div>
                <div class="db-kpi__label">Registered Candidates</div>
                <div class="db-kpi__bar-track">
                    <div class="db-kpi__bar-fill" [style.width]="stats.totalCandidates > 0 ? '100%' : '8%'"></div>
                </div>
            </div>

            <div class="db-kpi db-kpi--violet">
                <div class="db-kpi__header">
                    <div class="db-kpi__icon-wrap">
                        <i class="pi pi-building"></i>
                    </div>
                    <span class="db-kpi__trend db-kpi__trend--neutral">
                        <i class="pi pi-minus"></i> Total
                    </span>
                </div>
                <div class="db-kpi__value">{{ stats.totalEmployers }}</div>
                <div class="db-kpi__label">Registered Employers</div>
                <div class="db-kpi__bar-track">
                    <div class="db-kpi__bar-fill" [style.width]="stats.totalEmployers > 0 ? '100%' : '8%'"></div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- MIDDLE ROW — QUICK ACTIONS + PIPELINE               -->
        <!-- ═══════════════════════════════════════════════════ -->
        <div class="db-mid-grid animate-fade-in">

            <!-- Quick Actions -->
            <section-card>
                <ng-template #title>
                    <span class="db-card__icon-badge" style="background:#ede9fe; color:#7c3aed"><i class="pi pi-bolt"></i></span>
                    Quick Actions
                </ng-template>
                <div class="db-actions-grid">
                    <a routerLink="/jobs" class="db-action">
                        <div class="db-action__icon" style="background:linear-gradient(135deg,#4f46e5,#6366f1)">
                            <i class="pi pi-search"></i>
                        </div>
                        <span class="db-action__label">Browse Jobs</span>
                        <i class="pi pi-arrow-right db-action__arrow"></i>
                    </a>
                    @if (authService.currentUser()?.role === 'Employer') {
                        <a routerLink="/jobs/post" class="db-action">
                            <div class="db-action__icon" style="background:linear-gradient(135deg,#059669,#10b981)">
                                <i class="pi pi-plus"></i>
                            </div>
                            <span class="db-action__label">Post a Job</span>
                            <i class="pi pi-arrow-right db-action__arrow"></i>
                        </a>
                    }
                    <a routerLink="/applications" class="db-action">
                        <div class="db-action__icon" style="background:linear-gradient(135deg,#2563eb,#3b82f6)">
                            <i class="pi pi-send"></i>
                        </div>
                        <span class="db-action__label">Applications</span>
                        <i class="pi pi-arrow-right db-action__arrow"></i>
                    </a>
                    <a routerLink="/candidates" class="db-action">
                        <div class="db-action__icon" style="background:linear-gradient(135deg,#d97706,#f59e0b)">
                            <i class="pi pi-users"></i>
                        </div>
                        <span class="db-action__label">Candidates</span>
                        <i class="pi pi-arrow-right db-action__arrow"></i>
                    </a>
                    <a routerLink="/employers" class="db-action">
                        <div class="db-action__icon" style="background:linear-gradient(135deg,#0891b2,#06b6d4)">
                            <i class="pi pi-building"></i>
                        </div>
                        <span class="db-action__label">Employers</span>
                        <i class="pi pi-arrow-right db-action__arrow"></i>
                    </a>
                    <a routerLink="/profile" class="db-action">
                        <div class="db-action__icon" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
                            <i class="pi pi-user-edit"></i>
                        </div>
                        <span class="db-action__label">My Profile</span>
                        <i class="pi pi-arrow-right db-action__arrow"></i>
                    </a>
                </div>
            </section-card>

            <!-- Application Pipeline Visual -->
            <section-card>
                <ng-template #title>
                    <span class="db-card__icon-badge" style="background:#dcfce7; color:#059669"><i class="pi pi-chart-bar"></i></span>
                    Application Pipeline
                </ng-template>
                <ng-template #action>
                    <a routerLink="/applications" class="db-card__link">View all <i class="pi pi-arrow-right"></i></a>
                </ng-template>
                <div class="db-pipeline">
                    @for (step of pipeline; track step.label) {
                        <div class="db-pipeline__row">
                            <div class="db-pipeline__dot" [style.background]="step.color"></div>
                            <div class="db-pipeline__info">
                                <span class="db-pipeline__label">{{ step.label }}</span>
                                <span class="db-pipeline__count" [style.color]="step.color">{{ step.count }}</span>
                            </div>
                            <div class="db-pipeline__track">
                                <div class="db-pipeline__bar" [style.background]="step.color"
                                    [style.width]="getPipelineWidth(step.count)"></div>
                            </div>
                        </div>
                    }
                    @if (stats.totalApplications === 0) {
                        <div class="db-empty-inline">
                            <i class="pi pi-inbox"></i>
                            <span>No applications to display yet</span>
                        </div>
                    }
                </div>
            </section-card>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- BOTTOM ROW — RECENT JOBS + RECENT APPLICATIONS       -->
        <!-- ═══════════════════════════════════════════════════ -->
        <div class="db-bottom-grid animate-fade-in">

            <!-- Recent Jobs -->
            <section-card>
                <ng-template #title>
                    <span class="db-card__icon-badge" style="background:#ede9fe; color:#4f46e5"><i class="pi pi-briefcase"></i></span>
                    Recent Jobs
                </ng-template>
                <ng-template #action>
                    <a routerLink="/jobs" class="db-card__link">View all <i class="pi pi-arrow-right"></i></a>
                </ng-template>
                @if (recentJobs.length > 0) {
                    <div class="db-job-list">
                        @for (job of recentJobs; track job.id) {
                            <div class="db-job-row">
                                <div class="db-job-row__avatar" [style.background]="getCompanyColor(job.company)">
                                    {{ getCompanyInitial(job.company) }}
                                </div>
                                <div class="db-job-row__info">
                                    <div class="db-job-row__title">{{ job.title }}</div>
                                    <div class="db-job-row__meta">
                                        <i class="pi pi-building"></i> {{ job.company }}
                                        <span class="db-job-row__sep">·</span>
                                        <i class="pi pi-map-marker"></i> {{ job.location }}
                                    </div>
                                </div>
                                <div class="db-job-row__tags">
                                    <span class="db-badge" [class]="'db-badge--' + getJobTypeClass(job.type)">{{ job.type }}</span>
                                    <span class="db-badge" [class]="job.status === 'Open' ? 'db-badge--success' : 'db-badge--danger'">
                                        <i class="pi" [class]="job.status === 'Open' ? 'pi-check-circle' : 'pi-times-circle'"></i>
                                        {{ job.status }}
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                } @else {
                    <div class="db-empty-state">
                        <div class="db-empty-state__icon">
                            <i class="pi pi-briefcase"></i>
                        </div>
                        <p class="db-empty-state__text">No jobs posted yet</p>
                        @if (authService.currentUser()?.role === 'Employer') {
                            <a routerLink="/jobs/post" class="db-empty-state__cta">
                                <i class="pi pi-plus"></i> Post your first job
                            </a>
                        }
                    </div>
                }
            </section-card>

            <!-- Recent Applications -->
            <section-card>
                <ng-template #title>
                    <span class="db-card__icon-badge" style="background:#dcfce7; color:#059669"><i class="pi pi-send"></i></span>
                    Recent Applications
                </ng-template>
                <ng-template #action>
                    <a routerLink="/applications" class="db-card__link">View all <i class="pi pi-arrow-right"></i></a>
                </ng-template>
                @if (recentApplications.length > 0) {
                    <div class="db-app-timeline">
                        @for (app of recentApplications; track app.id; let last = $last) {
                            <div class="db-timeline-item" [class.db-timeline-item--last]="last">
                                <div class="db-timeline-item__dot" [style.background]="getStatusColor(app.status)">
                                    <i class="pi" [class]="getStatusIcon(app.status)"></i>
                                </div>
                                <div class="db-timeline-item__line" *ngIf="!last"></div>
                                <div class="db-timeline-item__body">
                                    <div class="db-timeline-item__header">
                                        <span class="db-timeline-item__title">Application #{{ app.id }}</span>
                                        <span class="db-badge" [class]="'db-badge--' + getStatusClass(app.status)">{{ app.status }}</span>
                                    </div>
                                    <div class="db-timeline-item__sub">
                                        <i class="pi pi-briefcase"></i> Job #{{ app.jobId }}
                                        <span class="db-timeline-item__sep">·</span>
                                        <i class="pi pi-clock"></i> {{ app.appliedAt | date:'MMM d, y' }}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                } @else {
                    <div class="db-empty-state">
                        <div class="db-empty-state__icon">
                            <i class="pi pi-send"></i>
                        </div>
                        <p class="db-empty-state__text">No applications yet</p>
                        <a routerLink="/jobs" class="db-empty-state__cta">
                            <i class="pi pi-search"></i> Browse open jobs
                        </a>
                    </div>
                }
            </section-card>
        </div>
    `
})
export class Dashboard implements OnInit {
    authService = inject(AuthService);
    private jobService = inject(JobService);
    private applicationService = inject(ApplicationService);
    private candidateService = inject(CandidateService);
    private employerService = inject(EmployerService);

    today = new Date();
    stats = { totalJobs: 0, totalApplications: 0, totalCandidates: 0, totalEmployers: 0 };
    recentJobs: Job[] = [];
    recentApplications: JobApplication[] = [];

    pipeline = [
        { label: 'Pending Review', count: 0, color: '#f59e0b' },
        { label: 'Reviewed',       count: 0, color: '#3b82f6' },
        { label: 'Shortlisted',    count: 0, color: '#8b5cf6' },
        { label: 'Hired',          count: 0, color: '#10b981' },
        { label: 'Rejected',       count: 0, color: '#ef4444' },
    ];

    ngOnInit() {
        this.jobService.getAll().subscribe({
            next: (jobs) => {
                this.stats.totalJobs = jobs.length;
                this.recentJobs = jobs.slice(0, 5);
            },
            error: () => {}
        });
        this.applicationService.getAll().subscribe({
            next: (apps) => {
                this.stats.totalApplications = apps.length;
                this.recentApplications = apps.slice(0, 5);
                this.pipeline[0].count = apps.filter(a => a.status === 'Pending').length;
                this.pipeline[1].count = apps.filter(a => a.status === 'Reviewed').length;
                this.pipeline[2].count = apps.filter(a => a.status === 'Shortlisted').length;
                this.pipeline[3].count = apps.filter(a => a.status === 'Hired').length;
                this.pipeline[4].count = apps.filter(a => a.status === 'Rejected').length;
            },
            error: () => {}
        });
        this.candidateService.getAll().subscribe({
            next: (candidates) => this.stats.totalCandidates = candidates.length,
            error: () => {}
        });
        this.employerService.getAll().subscribe({
            next: (employers) => this.stats.totalEmployers = employers.length,
            error: () => {}
        });
    }

    getTimeOfDay(): string {
        const h = new Date().getHours();
        if (h < 12) return 'morning';
        if (h < 17) return 'afternoon';
        return 'evening';
    }

    getUserInitials(): string {
        const email = this.authService.currentUser()?.email || '';
        return email.charAt(0).toUpperCase() || 'U';
    }

    getUserDisplayName(): string {
        const email = this.authService.currentUser()?.email || 'User';
        return email.split('@')[0];
    }

    getPipelineWidth(count: number): string {
        const max = Math.max(...this.pipeline.map(p => p.count), 1);
        return Math.max((count / max) * 100, count > 0 ? 8 : 0) + '%';
    }

    getCompanyInitial(company: string): string {
        return (company || '?').charAt(0).toUpperCase();
    }

    private companyColors = ['#4f46e5','#059669','#d97706','#7c3aed','#2563eb','#dc2626','#0891b2'];
    getCompanyColor(company: string): string {
        const idx = (company || '').charCodeAt(0) % this.companyColors.length;
        return this.companyColors[idx];
    }

    getJobTypeClass(type: string): string {
        const map: Record<string, string> = {
            'FullTime': 'success', 'PartTime': 'info', 'Contract': 'warn', 'Remote': 'cyan', 'Internship': 'violet'
        };
        return map[type] || 'info';
    }

    getStatusColor(status: string): string {
        const map: Record<string, string> = {
            'Pending': '#f59e0b', 'Reviewed': '#3b82f6', 'Shortlisted': '#8b5cf6',
            'Rejected': '#ef4444', 'Hired': '#10b981'
        };
        return map[status] || '#94a3b8';
    }

    getStatusIcon(status: string): string {
        const map: Record<string, string> = {
            'Pending': 'pi-clock', 'Reviewed': 'pi-eye', 'Shortlisted': 'pi-star',
            'Rejected': 'pi-times', 'Hired': 'pi-check'
        };
        return map[status] || 'pi-circle';
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            'Pending': 'warn', 'Reviewed': 'info', 'Shortlisted': 'violet',
            'Rejected': 'danger', 'Hired': 'success'
        };
        return map[status] || 'info';
    }

    getJobTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
            'FullTime': 'success', 'PartTime': 'info', 'Contract': 'warn', 'Remote': 'secondary' as any
        };
        return map[type] || 'info';
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            'Pending': 'warn', 'Reviewed': 'info', 'Shortlisted': 'success', 'Rejected': 'danger', 'Hired': 'success'
        };
        return map[status] || 'info';
    }
}
