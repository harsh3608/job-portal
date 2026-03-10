import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, CheckboxModule],
    template: `
        <div class="login-container">
            <div class="login-card">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">JobPortal</h1>
                    <p class="text-surface-600 dark:text-surface-400">Sign in to your account</p>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Email</label>
                        <input pInputText id="email" [(ngModel)]="email" placeholder="Enter your email" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-surface-700 dark:text-surface-300 text-sm font-medium">Password</label>
                        <p-password id="password" [(ngModel)]="password" placeholder="Enter your password" [toggleMask]="true" [feedback]="false" styleClass="w-full" inputStyleClass="w-full"></p-password>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <p-checkbox [(ngModel)]="rememberMe" [binary]="true" inputId="rememberMe"></p-checkbox>
                            <label for="rememberMe" class="text-surface-600 dark:text-surface-400 text-sm">Remember me</label>
                        </div>
                    </div>

                    <p-button label="Sign In" styleClass="w-full" (onClick)="onLogin()"></p-button>

                    <div class="text-center">
                        <span class="text-surface-600 dark:text-surface-400 text-sm">Don't have an account? </span>
                        <a routerLink="/auth/register" class="text-primary font-medium text-sm no-underline hover:underline">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .login-container {
            width: 100%;
            max-width: 420px;
            padding: 2rem;
        }
        .login-card {
            background: var(--p-surface-card);
            border-radius: 1rem;
            padding: 2.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    `]
})
export class Login {
    email = '';
    password = '';
    rememberMe = false;

    onLogin() {
        console.log('Login:', { email: this.email, rememberMe: this.rememberMe });
    }
}
