import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from './menubar';
import { markActive } from 'prosemirror-preset-utils';
import { GlobalService } from 'src/app/global.service';
import { toggleMark } from 'prosemirror-commands';

@Component({
  selector: 'ng-prose-editor-menubar',
  templateUrl: './prose-editor-menubar.component.html',
  styleUrls: ['./prose-editor-menubar.component.scss'],
  standalone: true,
})
export class ProseEditorMenubarComponent implements OnDestroy, PluginView {
  private readonly _editorView = inject(ProseMirrorEditorView);
  private readonly _globalService = inject(GlobalService);
  private readonly _cdr = inject(ChangeDetectorRef);

  private readonly _toggleBold = toggleMark(
    this._editorView.state.schema.marks['strong'],
  );
  private readonly _toggleItalic = toggleMark(
    this._editorView.state.schema.marks['em'],
  );
  private readonly _toggleStrikethrough = toggleMark(
    this._editorView.state.schema.marks['strikethrough'],
  );
  private readonly _toggleInlineCode = toggleMark(
    this._editorView.state.schema.marks['code'],
  );

  public bold = false;
  public italic = false;
  public strikethrough = false;
  public inlineCode = false;

  public update(editorView: EditorView, prevState: EditorState): void {
    this.bold = markActive(
      editorView.state,
      editorView.state.schema.marks['strong'],
    );

    this.italic = markActive(
      editorView.state,
      editorView.state.schema.marks['em'],
    );

    this.strikethrough = markActive(
      editorView.state,
      editorView.state.schema.marks['strikethrough'],
    );

    this.inlineCode = markActive(
      editorView.state,
      editorView.state.schema.marks['code'],
    );
  }

  public toggleBold(): void {
    this._toggleBold(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public toggleItalic(): void {
    this._toggleItalic(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public toggleStrikethrough(): void {
    this._toggleStrikethrough(
      this._editorView.state,
      this._editorView.dispatch,
    );
    this._editorView.focus();
  }

  public toggleInlineCode(): void {
    this._toggleInlineCode(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public ngOnDestroy(): void {
    console.log('menubar destroy');
  }
}
