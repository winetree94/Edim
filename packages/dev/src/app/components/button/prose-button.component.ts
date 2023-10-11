import { Component } from '@angular/core';

@Component({
  selector: 'button[prose-button]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./prose-button.component.scss'],
  standalone: true,
})
export class ProseButtonComponent {}
