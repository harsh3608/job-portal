import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h2>Welcome to JobPortal</h2>
                    <p>Your centralized job management dashboard.</p>
                </div>
            </div>
        </div>
    `
})
export class Dashboard {}
