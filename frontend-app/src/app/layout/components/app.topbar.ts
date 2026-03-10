import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';

@Component({
  selector: '[app-topbar]',
  standalone: true,
  imports: [RouterModule, CommonModule, AppBreadcrumb],
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
          <li class="profile-item static sm:relative">
            <a class="right-sidebar-button relative z-50">
              <i class="pi pi-user" style="font-size: 1.25rem"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class AppTopbar {
  layoutService = inject(LayoutService);
  isDarkTheme = computed(() => this.layoutService.isDarkTheme());

  @ViewChild('menubutton') menuButton!: ElementRef;

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }
}
