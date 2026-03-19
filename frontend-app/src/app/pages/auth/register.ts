import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="auth-card animate-fade-in">
            <div class="auth-card__eyebrow">Create account</div>

            <div class="auth-brand">
                <div class="auth-logo" aria-hidden="true"><i class="pi pi-user-plus"></i></div>
                <h1>Create account</h1>
                <p>Set up your workspace access and get into the hiring pipeline in minutes.</p>
            </div>

            @if (errorMessage) {
                <p-message severity="error" [text]="errorMessage" styleClass="auth-message"></p-message>
            }
            @if (successMessage) {
                <p-message severity="success" [text]="successMessage" styleClass="auth-message"></p-message>
            }

            <div class="auth-form">
                <div class="auth-field">
                    <label for="fullName">Full name</label>
                    <p-iconfield class="auth-input-shell">
                        <p-inputicon styleClass="pi pi-user" />
                        <input pInputText id="fullName" name="fullName" [(ngModel)]="fullName" placeholder="Enter your full name" autocomplete="name" class="auth-input" />
                    </p-iconfield>
                </div>

                <div class="auth-field">
                    <label for="email">Email address</label>
                    <p-iconfield class="auth-input-shell">
                        <p-inputicon styleClass="pi pi-envelope" />
                        <input pInputText id="email" name="email" type="email" [(ngModel)]="email" placeholder="Enter your email" autocomplete="email" class="auth-input" />
                    </p-iconfield>
                </div>

                <div class="auth-field">
                    <label for="role">I am a</label>
                    <p-select id="role" [(ngModel)]="role" [options]="roles" optionLabel="label" optionValue="value" placeholder="Select role" styleClass="auth-select"></p-select>
                </div>

                <div class="auth-field">
                    <label for="password">Password</label>
                    <p-password id="password" name="password" [(ngModel)]="password" placeholder="Create a password" [toggleMask]="true" autocomplete="new-password" styleClass="auth-password" inputStyleClass="auth-input auth-input--password"></p-password>
                </div>

                <div class="auth-field">
                    <label for="confirmPassword">Confirm password</label>
                    <p-password id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Confirm your password" [toggleMask]="true" [feedback]="false" autocomplete="new-password" styleClass="auth-password" inputStyleClass="auth-input auth-input--password"></p-password>
                </div>

                <p-button label="Create Account" styleClass="auth-submit" [loading]="loading" (onClick)="onRegister()" icon="pi pi-check"></p-button>

                <div class="auth-footer">
                    <span>Already have an account?</span>
                    <a routerLink="/auth/login">Sign in</a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            width: 100%;
            max-width: 34rem;
        }

        .auth-card {
            position: relative;
            overflow: hidden;
            border-radius: 2rem;
            padding: clamp(1.5rem, 4vw, 2.4rem);
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(146, 173, 203, 0.35);
            box-shadow: 0 28px 80px rgba(37, 58, 89, 0.16);
            backdrop-filter: blur(18px);
        }

        .auth-card::before {
            content: '';
            position: absolute;
            inset: 0 auto auto 0;
            width: 11rem;
            height: 11rem;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(255, 184, 108, 0.24), transparent 70%);
            transform: translate(-35%, -35%);
            pointer-events: none;
        }

        .auth-card__eyebrow {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 0.45rem 0.8rem;
            margin-bottom: 1.25rem;
            background: #edf3ff;
            color: #1e4d8f;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .auth-brand {
            position: relative;
            z-index: 1;
            margin-bottom: 1.75rem;
            text-align: left;
        }

        .auth-logo {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 1.1rem;
            background: linear-gradient(145deg, #153b66 0%, #2d7b7f 100%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            box-shadow: 0 16px 30px rgba(21, 59, 102, 0.22);
        }

        .auth-logo i {
            font-size: 1.35rem;
            color: #fff;
        }

        .auth-brand h1 {
            margin: 0;
            color: #11253d;
            font-size: clamp(2rem, 4vw, 2.6rem);
            line-height: 1.02;
            letter-spacing: -0.04em;
        }

        .auth-brand p {
            margin: 0.85rem 0 0;
            color: #52637a;
            font-size: 0.98rem;
            line-height: 1.7;
        }

        .auth-form {
            position: relative;
            z-index: 1;
            display: grid;
            gap: 1.15rem;
        }

        .auth-field {
            display: grid;
            gap: 0.45rem;
        }

        .auth-field label,
        .auth-footer span {
            color: #24384f;
            font-size: 0.92rem;
            font-weight: 700;
        }

        .auth-input-shell,
        .auth-password,
        .auth-select {
            width: 100%;
        }

        .auth-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.35rem;
            padding-top: 0.25rem;
        }

        .auth-footer span {
            color: #6d7c90;
            font-size: 0.84rem;
            font-weight: 500;
        }

        .auth-footer a {
            color: #1e4d8f;
            font-weight: 700;
            text-decoration: none;
        }

        .auth-footer a:hover,
        .auth-footer a:focus-visible {
            text-decoration: underline;
        }

        :host ::ng-deep .auth-message {
            width: 100%;
        }

        :host ::ng-deep .auth-input,
        :host ::ng-deep .auth-input--password,
        :host ::ng-deep .auth-select .p-select-label {
            width: 100%;
            min-height: 3.2rem;
            border-radius: 1rem;
            background: rgba(247, 250, 255, 0.92);
            color: #11253d;
        }

        :host ::ng-deep .auth-input,
        :host ::ng-deep .auth-input--password,
        :host ::ng-deep .auth-select,
        :host ::ng-deep .auth-select .p-select-label {
            border: 1px solid #ced7e4;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        :host ::ng-deep .auth-input:enabled:focus,
        :host ::ng-deep .auth-input--password:enabled:focus,
        :host ::ng-deep .auth-select.p-focus {
            border-color: #2d7b7f;
            box-shadow: 0 0 0 0.2rem rgba(45, 123, 127, 0.14);
            background: #fff;
        }

        :host ::ng-deep .auth-password .p-password-input {
            width: 100%;
        }

        :host ::ng-deep .auth-submit {
            width: 100%;
            justify-content: center;
            min-height: 3.3rem;
            border-radius: 1rem;
            background: linear-gradient(135deg, #153b66 0%, #2d7b7f 100%);
            border: none;
            box-shadow: 0 16px 30px rgba(21, 59, 102, 0.2);
        }

        @media (max-width: 640px) {
            :host {
                max-width: none;
            }

            .auth-card {
                border-radius: 1.5rem;
                padding: 1.35rem;
            }

            .auth-footer {
                flex-direction: column;
                text-align: center;
            }
        }
    `]
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
