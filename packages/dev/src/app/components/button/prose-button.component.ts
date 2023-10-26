import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'button[prose-button]',
  exportAs: 'proseButton',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./prose-button.component.scss'],
  standalone: true,
})
export class ProseButtonComponent {
  public readonly elementRef = inject(ElementRef);
}
