import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="notfound-container">
            <div class="text-center">
                <div class="text-8xl font-bold text-primary mb-4">404</div>
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">Page Not Found</h1>
                <p class="text-surface-600 dark:text-surface-400 mb-6">The page you're looking for doesn't exist.</p>
                <a routerLink="/" class="text-primary font-medium no-underline hover:underline">Go back to Dashboard</a>
            </div>
        </div>
    `,
    styles: [`
        .notfound-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--p-surface-ground);
        }
    `]
})
export class NotFound {}
