import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'section-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="hasTitle || hasDescription || hasAction" class="section-card-header">
            <div>
                <ng-container *ngIf="titleTemplate">
                    <h4 class="section-card-title">
                        <ng-container *ngTemplateOutlet="titleTemplate"></ng-container>
                    </h4>
                </ng-container>

                <ng-container *ngIf="descriptionTemplate">
                    <p class="section-card-description">
                        <ng-container *ngTemplateOutlet="descriptionTemplate"></ng-container>
                    </p>
                </ng-container>
            </div>

            <ng-container *ngIf="actionTemplate" [ngTemplateOutlet]="actionTemplate"></ng-container>
        </div>

        <ng-content></ng-content>
        <ng-container *ngIf="footerTemplate" [ngTemplateOutlet]="footerTemplate"></ng-container>
    `,
    host: {
        class: 'card'
    }
})
export class SectionCard {
    @ContentChild('title') titleTemplate!: TemplateRef<any>;

    @ContentChild('description') descriptionTemplate!: TemplateRef<any>;

    @ContentChild('action') actionTemplate!: TemplateRef<any>;

    @ContentChild('footer') footerTemplate!: TemplateRef<any>;

    hasTitle = false;

    hasDescription = false;

    hasAction = false;

    ngAfterContentInit() {
        this.hasTitle = !!this.titleTemplate;
        this.hasDescription = !!this.descriptionTemplate;
        this.hasAction = !!this.actionTemplate;
    }
}
