import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <div class="auth-layout">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .auth-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--p-surface-ground);
        }
    `]
})
export class AppAuthLayout {}
