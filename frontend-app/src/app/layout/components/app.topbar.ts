import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: '[app-topbar]',
  standalone: true,
  imports: [RouterModule, CommonModule, AppBreadcrumb, ButtonModule, TagModule, MenuModule],
  template: `
    <div class="layout-topbar">
      <div class="topbar-left">
        <a tabindex="0" #menubutton type="button" class="menu-button" (click)="onMenuButtonClick()">
          <i class="pi pi-chevron-left"></i>
        </a>
        <img class="horizontal-logo" src="/layout/images/logo-white.svg" alt="logo" />
        <span class="topbar-separator"></span>
        <div app-breadcrumb></div>
        <a routerLink="/">
          <img class="mobile-logo" src="/layout/images/logo-{{ isDarkTheme() ? 'white' : 'dark' }}.svg" alt="logo" />
        </a>
      </div>
      <div class="topbar-right">
        <ul class="topbar-menu">
          @if (authService.isAuthenticated()) {
            <li class="flex items-center gap-2">
              <span class="text-sm text-surface-500 hidden sm:inline">{{ authService.currentUser()?.email }}</span>
              <p-tag [value]="authService.currentUser()?.role || ''" severity="info" class="hidden sm:inline-flex"></p-tag>
            </li>
            <li class="profile-item static sm:relative">
              <a class="right-sidebar-button relative z-50 cursor-pointer" (click)="profileMenu.toggle($event)">
                <i class="pi pi-user" style="font-size: 1.25rem"></i>
              </a>
              <p-menu #profileMenu [popup]="true" [model]="profileMenuItems"></p-menu>
            </li>
          } @else {
            <li>
              <a routerLink="/auth/login" class="flex items-center gap-2 cursor-pointer text-surface-700 dark:text-surface-200 hover:text-primary">
                <i class="pi pi-sign-in"></i>
                <span class="text-sm">Login</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class AppTopbar {
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  private router = inject(Router);
  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  @ViewChild('menubutton') menuButton!: ElementRef;

  profileMenuItems: MenuItem[] = [
    { label: 'My Profile', icon: 'pi pi-user', routerLink: '/profile' },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }}
  ];

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }
}
