import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injector,
  createComponent,
} from '@angular/core';
import { MentionState } from 'prosemirror-preset-mention';
import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionComponent } from 'src/app/components/prose-editor/mention/mention.component';

export class MentionView implements PluginView {
  public componentRef: ComponentRef<MentionComponent> | null = null;

  public constructor(
    private readonly _editorView: EditorView,
    private readonly _plugin: Plugin<MentionState>,
    private readonly environmentInjector: EnvironmentInjector,
    private readonly applicationRef: ApplicationRef,
    private readonly elementInjector: Injector,
  ) {}

  public update(view: EditorView, prevState: EditorState) {
    const opened = this._plugin.getState(view.state)?.actived;
    if (opened && !this.componentRef) {
      this.componentRef = createComponent(MentionComponent, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.elementInjector,
      });
      this.applicationRef.attachView(this.componentRef.hostView);
      const dom = this.componentRef.location.nativeElement;
      this._editorView.dom.parentElement?.appendChild(dom);
    } else if (!opened && this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    this.componentRef?.instance.update(view, prevState);
  }

  public destroy(): void {
    return;
  }
}
