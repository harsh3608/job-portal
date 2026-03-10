import { Component } from '@angular/core';

@Component({
    selector: 'app-candidate-list',
    standalone: true,
    template: `
        <div class="card">
            <h2>Browse Candidates</h2>
            <p>Candidate listings will appear here.</p>
        </div>
    `
})
export class CandidateList {}
