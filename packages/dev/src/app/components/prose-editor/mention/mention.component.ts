import { Component, ElementRef, inject } from '@angular/core';
import { MentionPos } from 'prosemirror-preset-mention';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

@Component({
  selector: 'pmp-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.scss'],
  standalone: true,
  imports: [],
})
export class MentionComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public update(view: EditorView, prevState: EditorState): void {
    return;
  }

  public mentionPosChange(start: MentionPos): void {
    this.elementRef.nativeElement.style.top = start.top + 20 + 'px';
    this.elementRef.nativeElement.style.left = start.left + 'px';
  }

  public arrowKeydown(event: KeyboardEvent) {
  }
}
