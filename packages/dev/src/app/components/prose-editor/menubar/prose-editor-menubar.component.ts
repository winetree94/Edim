import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from './menubar';
import { markActive } from 'prosemirror-preset-utils';
import { GlobalService } from 'src/app/global.service';
import { toggleMark } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ng-prose-editor-menubar',
  templateUrl: './prose-editor-menubar.component.html',
  styleUrls: ['./prose-editor-menubar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProseEditorMenubarComponent implements OnDestroy, PluginView {
  private readonly _editorView = inject(ProseMirrorEditorView);
  private readonly _globalService = inject(GlobalService);
  private readonly _cdr = inject(ChangeDetectorRef);

  public linkFormActive = false;
  public readonly linkForm = new FormGroup({
    from: new FormControl<number>(0, { nonNullable: true }),
    to: new FormControl<number>(0, { nonNullable: true }),
    text: new FormControl<string>('', { nonNullable: true }),
    url: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

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

  public setLink(): void {
    const rangeHasLinkMark = this._editorView.state.doc.rangeHasMark(
      this._editorView.state.selection.from,
      this._editorView.state.selection.to,
      this._editorView.state.schema.marks['link'],
    );

    if (!rangeHasLinkMark) {
      this.linkFormActive = true;
      return this.linkForm.patchValue({
        from: this._editorView.state.selection.from,
        to: this._editorView.state.selection.to,
        text: this._editorView.state.doc.textBetween(
          this._editorView.state.selection.from,
          this._editorView.state.selection.to,
        ),
        url: '',
      });
    }
  }

  public linkSubmit(): void {
    const values = this.linkForm.getRawValue();
    this._editorView.dispatch(
      this._editorView.state.tr
        .removeMark(
          values.from,
          values.to,
          this._editorView.state.schema.marks['link'],
        )
        .addMark(
          values.from,
          values.to,
          this._editorView.state.schema.marks['link'].create({
            href: values.url,
          }),
        ),
    );
    this.linkFormActive = false;
  }

  public ngOnDestroy(): void {
    console.log('menubar destroy');
  }
}
