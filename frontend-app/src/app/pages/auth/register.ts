import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, SelectModule, MessageModule, IconFieldModule, InputIconModule],
    template: `
        <div class="auth-card animate-fade-in">
            <div class="auth-brand">
                <div class="auth-logo"><i class="pi pi-user-plus"></i></div>
                <h1>Create Account</h1>
                <p>Join JobPortal and start your journey</p>
            </div>

            @if (errorMessage) {
                <p-message severity="error" [text]="errorMessage" styleClass="w-full mb-4"></p-message>
            }
            @if (successMessage) {
                <p-message severity="success" [text]="successMessage" styleClass="w-full mb-4"></p-message>
            }

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="fullName" class="text-surface-700 text-sm font-semibold">Full Name</label>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-user" />
                        <input pInputText id="fullName" [(ngModel)]="fullName" placeholder="Enter your full name" class="w-full" />
                    </p-iconfield>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="email" class="text-surface-700 text-sm font-semibold">Email</label>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-envelope" />
                        <input pInputText id="email" [(ngModel)]="email" placeholder="Enter your email" class="w-full" />
                    </p-iconfield>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="role" class="text-surface-700 text-sm font-semibold">I am a</label>
                    <p-select id="role" [(ngModel)]="role" [options]="roles" optionLabel="label" optionValue="value" placeholder="Select role" styleClass="w-full"></p-select>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="password" class="text-surface-700 text-sm font-semibold">Password</label>
                    <p-password id="password" [(ngModel)]="password" placeholder="Create a password" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="confirmPassword" class="text-surface-700 text-sm font-semibold">Confirm Password</label>
                    <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Confirm your password" [toggleMask]="true" [feedback]="false" styleClass="w-full" inputStyleClass="w-full"></p-password>
                </div>

                <p-button label="Create Account" styleClass="w-full" [loading]="loading" (onClick)="onRegister()" icon="pi pi-check"></p-button>

                <div class="text-center" style="margin-top: 0.5rem;">
                    <span class="text-surface-500 text-sm">Already have an account? </span>
                    <a routerLink="/auth/login" class="text-primary font-semibold text-sm no-underline hover:underline">Sign in</a>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class Register {
    private authService = inject(AuthService);
    private router = inject(Router);

    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    role = '';
    loading = false;
    errorMessage = '';
    successMessage = '';

    roles = [
        { label: 'Job Seeker', value: 'Candidate' },
        { label: 'Employer', value: 'Employer' }
    ];

    onRegister() {
        if (!this.fullName || !this.email || !this.password || !this.role) {
            this.errorMessage = 'All fields are required.';
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }
        this.loading = true;
        this.errorMessage = '';
        this.authService.register({
            fullName: this.fullName,
            email: this.email,
            password: this.password,
            role: this.role
        }).subscribe({
            next: () => {
                this.successMessage = 'Account created! Redirecting to login...';
                setTimeout(() => this.router.navigate(['/auth/login']), 1500);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
