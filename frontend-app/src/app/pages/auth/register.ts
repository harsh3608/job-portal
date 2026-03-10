import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, SelectModule],
    template: `
        <div class="register-container">
            <div class="register-card">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">JobPortal</h1>
                    <p class="text-surface-600 dark:text-surface-400">Create your account</p>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="fullName" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Full Name</label>
                        <input pInputText id="fullName" [(ngModel)]="fullName" placeholder="Enter your full name" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Email</label>
                        <input pInputText id="email" [(ngModel)]="email" placeholder="Enter your email" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="role" class="text-surface-700 dark:text-surface-300 text-sm font-medium">I am a</label>
                        <p-select id="role" [(ngModel)]="role" [options]="roles" optionLabel="label" optionValue="value" placeholder="Select role" styleClass="w-full"></p-select>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Password</label>
                        <p-password id="password" [(ngModel)]="password" placeholder="Create a password" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="confirmPassword" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Confirm Password</label>
                        <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Confirm your password" [toggleMask]="true" [feedback]="false" styleClass="w-full" inputStyleClass="w-full"></p-password>
                    </div>

                    <p-button label="Create Account" styleClass="w-full" (onClick)="onRegister()"></p-button>

                    <div class="text-center">
                        <span class="text-surface-600 dark:text-surface-400 text-sm">Already have an account? </span>
                        <a routerLink="/auth/login" class="text-primary font-medium text-sm no-underline hover:underline">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .register-container {
            width: 100%;
            max-width: 420px;
            padding: 2rem;
        }
        .register-card {
            background: var(--p-surface-card);
            border-radius: 1rem;
            padding: 2.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    `]
})
export class Register {
    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    role = '';

    roles = [
        { label: 'Job Seeker', value: 'candidate' },
        { label: 'Employer', value: 'employer' }
    ];

    onRegister() {
        console.log('Register:', { fullName: this.fullName, email: this.email, role: this.role });
    }
}
