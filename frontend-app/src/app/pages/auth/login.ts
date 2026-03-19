import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, CheckboxModule, MessageModule, IconFieldModule, InputIconModule],
    template: `
        <div class="auth-card animate-fade-in">
            <div class="auth-brand">
                <div class="auth-logo"><i class="pi pi-briefcase"></i></div>
                <h1>Welcome Back</h1>
                <p>Sign in to your JobPortal account</p>
            </div>

            @if (errorMessage) {
                <p-message severity="error" [text]="errorMessage" styleClass="w-full mb-4"></p-message>
            }

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="email" class="text-surface-700 text-sm font-semibold">Email</label>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-envelope" />
                        <input pInputText id="email" [(ngModel)]="email" placeholder="Enter your email" class="w-full" />
                    </p-iconfield>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="password" class="text-surface-700 text-sm font-semibold">Password</label>
                    <p-password id="password" [(ngModel)]="password" placeholder="Enter your password" [toggleMask]="true" [feedback]="false" styleClass="w-full" inputStyleClass="w-full"></p-password>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="rememberMe" [binary]="true" inputId="rememberMe"></p-checkbox>
                        <label for="rememberMe" class="text-surface-600 text-sm">Remember me</label>
                    </div>
                </div>

                <p-button label="Sign In" styleClass="w-full" [loading]="loading" (onClick)="onLogin()" icon="pi pi-sign-in"></p-button>

                <div class="text-center" style="margin-top: 0.5rem;">
                    <span class="text-surface-500 text-sm">Don't have an account? </span>
                    <a routerLink="/auth/register" class="text-primary font-semibold text-sm no-underline hover:underline">Create one</a>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    rememberMe = false;
    loading = false;
    errorMessage = '';

    onLogin() {
        if (!this.email || !this.password) {
            this.errorMessage = 'Please enter email and password.';
            return;
        }
        this.loading = true;
        this.errorMessage = '';
        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Invalid email or password.';
            }
        });
    }
}
