import { Component } from '@angular/core';

@Component({
    selector: 'app-job-list',
    standalone: true,
    template: `
        <div class="card">
            <h2>Browse Jobs</h2>
            <p>Job listings will appear here.</p>
        </div>
    `
})
export class JobList {}
