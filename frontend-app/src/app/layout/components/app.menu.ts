import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: '[app-menu]',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `,
})
export class AppMenu {
  model: any[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-gauge',
          routerLink: ['/'],
        },
      ],
    },
    { separator: true },
    {
      label: 'Jobs',
      icon: 'pi pi-briefcase',
      items: [
        {
          label: 'Browse Jobs',
          icon: 'pi pi-fw pi-search',
          routerLink: ['/jobs'],
        },
        {
          label: 'Post a Job',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['/jobs/post'],
        },
      ],
    },
    { separator: true },
    {
      label: 'Applications',
      icon: 'pi pi-file',
      items: [
        {
          label: 'My Applications',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/applications'],
        },
      ],
    },
    { separator: true },
    {
      label: 'Candidates',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Browse Candidates',
          icon: 'pi pi-fw pi-search',
          routerLink: ['/candidates'],
        },
        {
          label: 'Resume Search',
          icon: 'pi pi-fw pi-file-pdf',
          routerLink: ['/candidates/resume-search'],
        },
      ],
    },
    { separator: true },
    {
      label: 'Employers',
      icon: 'pi pi-building',
      items: [
        {
          label: 'Employers List',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/employers'],
        },
      ],
    },
  ];
}
