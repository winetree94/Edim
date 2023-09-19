import { Component, ElementRef, inject } from '@angular/core';
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
    const { from, to } = view.state.selection;
    // These are in screen coordinates
    const start = view.coordsAtPos(from);

    this.elementRef.nativeElement.style.top = start.top + 20 + 'px';
    this.elementRef.nativeElement.style.left = start.left + 'px';

    return;
  }
}
