import { Component } from '@angular/core';

@Component({
    selector: 'app-profile',
    standalone: true,
    template: `
        <div class="card">
            <h2>My Profile</h2>
            <p>Profile settings will appear here.</p>
        </div>
    `
})
export class Profile {}
