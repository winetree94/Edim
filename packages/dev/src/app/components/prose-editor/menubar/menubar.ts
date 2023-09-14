import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  InjectionToken,
  Injector,
  createComponent,
} from '@angular/core';
import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseEditorMenubarComponent } from 'src/app/components/prose-editor/menubar/prose-editor-menubar.component';

export const ProseMirrorEditorView = new InjectionToken<EditorView>(
  'prosemirror-editor-view',
);

export class NgMenubarView implements PluginView {
  private componentRef: ComponentRef<ProseEditorMenubarComponent>;

  public constructor(
    private readonly editorView: EditorView,
    private readonly applicationRef: ApplicationRef,
    private readonly environmentInjector: EnvironmentInjector,
  ) {
    this.componentRef = createComponent(ProseEditorMenubarComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: Injector.create({
        providers: [
          {
            provide: ProseMirrorEditorView,
            useValue: this.editorView,
          },
        ],
      }),
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    this.editorView.dom.parentNode?.insertBefore(
      this.componentRef.location.nativeElement,
      this.editorView.dom,
    );
  }

  public update(view: EditorView, prevState: EditorState) {
    this.componentRef.instance.update(view, prevState);
  }

  public destroy() {
    this.componentRef.destroy();
  }
}
