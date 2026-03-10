import { Component } from '@angular/core';

@Component({
    selector: 'app-application-list',
    standalone: true,
    template: `
        <div class="card">
            <h2>My Applications</h2>
            <p>Your job applications will appear here.</p>
        </div>
    `
})
export class ApplicationList {}
