import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { EditorState, PluginView, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from './menubar';
import {
  findParentNode,
  lift,
  markActive,
  wrapIn,
} from 'prosemirror-preset-utils';
import { GlobalService } from 'src/app/global.service';
import { toggleMark } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProseButtonComponent } from 'src/app/components/button/prose-button.component';
import { ProseSeparatorComponent } from 'src/app/components/separator/prose-separator.component';
import { redo, undo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-preset-paragraph';
import { Fragment, Node } from 'prosemirror-model';
import { SubscriptionLike, fromEvent, merge, take, tap } from 'rxjs';

@Component({
  selector: 'ng-prose-editor-menubar',
  templateUrl: './prose-editor-menubar.component.html',
  styleUrls: ['./prose-editor-menubar.component.scss'],
  standalone: true,
  imports: [
    ProseButtonComponent,
    ProseSeparatorComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ProseEditorMenubarComponent
  implements OnInit, OnDestroy, PluginView
{
  private readonly _subscriptions: SubscriptionLike[] = [];
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

  public isScrollTop = false;

  public activeBold = false;
  public activeItalic = false;
  public activeStrikethrough = false;
  public activeInlineCode = false;
  public activeLink = false;
  public activeOrderedList = false;
  public activeUnorderedList = false;

  public canAlign = false;
  public canOrderedList = true;
  public canUnorderedList = true;
  public canUndo = false;
  public canRedo = false;

  public update(editorView: EditorView, prevState: EditorState): void {
    this.activeBold = markActive(
      editorView.state,
      editorView.state.schema.marks['strong'],
    );

    this.activeItalic = markActive(
      editorView.state,
      editorView.state.schema.marks['em'],
    );

    this.activeStrikethrough = markActive(
      editorView.state,
      editorView.state.schema.marks['strikethrough'],
    );

    this.activeInlineCode = markActive(
      editorView.state,
      editorView.state.schema.marks['code'],
    );

    this.activeLink = markActive(
      editorView.state,
      editorView.state.schema.marks['link'],
    );

    this.activeOrderedList = !!findParentNode(
      editorView.state,
      editorView.state.schema.nodes['ordered_list'],
    );

    this.activeUnorderedList = !!findParentNode(
      editorView.state,
      editorView.state.schema.nodes['bullet_list'],
    );

    this.canUndo = undo(editorView.state);
    this.canRedo = redo(editorView.state);
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
    if (this.linkFormActive) {
      this.linkFormActive = false;
      return;
    }

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

  public onUndoClick(): void {
    undo(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onRedoClick(): void {
    redo(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onOrderedListClick(): void {
    if (
      findParentNode(
        this._editorView.state,
        this._editorView.state.schema.nodes['ordered_list'],
      )
    ) {
      const tr = wrapInList(
        this._editorView.state,
        lift(this._editorView.state, this._editorView.state.tr),
        this._editorView.state.schema.nodes['ordered_list'],
      );
      this._editorView.dispatch(tr);
      this._editorView.focus();
    } else if (
      findParentNode(
        this._editorView.state,
        this._editorView.state.schema.nodes['bullet_list'],
      )
    ) {
      const tr = lift(this._editorView.state, this._editorView.state.tr);
      this._editorView.dispatch(tr);
      this._editorView.focus();
      return;
    } else {
      const tr = wrapInList(
        this._editorView.state,
        this._editorView.state.tr,
        this._editorView.state.schema.nodes['ordered_list'],
      );
      this._editorView.dispatch(tr);
      this._editorView.focus();
    }
  }

  public onUnorderedListClick(): void {
    if (
      findParentNode(
        this._editorView.state,
        this._editorView.state.schema.nodes['ordered_list'],
      )
    ) {
      const tr = wrapInList(
        this._editorView.state,
        lift(this._editorView.state, this._editorView.state.tr),
        this._editorView.state.schema.nodes['ordered_list'],
      );
      this._editorView.dispatch(tr);
      this._editorView.focus();
    } else if (
      findParentNode(
        this._editorView.state,
        this._editorView.state.schema.nodes['bullet_list'],
      )
    ) {
      const tr = lift(this._editorView.state, this._editorView.state.tr);
      this._editorView.dispatch(tr);
      this._editorView.focus();
      return;
    } else {
      const tr = wrapInList(
        this._editorView.state,
        this._editorView.state.tr,
        this._editorView.state.schema.nodes['bullet_list'],
      );
      this._editorView.dispatch(tr);
      this._editorView.focus();
    }
  }

  public onIncreaseIndentClick(): void {
    return;
  }

  public onDecreaseIndentClick(): void {
    return;
  }

  public onImageClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.hidden = true;
    input.value = '';
    document.body.appendChild(input);

    this._subscriptions.push(
      merge(
        fromEvent(input, 'change').pipe(
          tap((event) => {
            console.log('change');
            const reader = new FileReader();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            reader.readAsDataURL((event.target as HTMLInputElement).files![0]);
            reader.onload = () => {
              const tr = this._editorView.state.tr;
              const node = this._editorView.state.schema.nodes['image'].create({
                src: reader.result as string,
              });
              this._editorView.dispatch(tr.replaceSelectionWith(node));
            };
          }),
        ),
        fromEvent(input, 'blur').pipe(),
      )
        .pipe(
          take(1),
          tap(() => input.parentElement?.removeChild(input)),
        )
        .subscribe(),
    );
    input.click();

    return;
  }

  public onMentionClick(): void {
    const tr = this._editorView.state.tr.insertText('@');
    this._editorView.dispatch(tr);
    this._editorView.focus();
  }

  public onBlockQuoteClick(): void {
    const tr = wrapIn(
      this._editorView.state,
      this._editorView.state.tr,
      this._editorView.state.schema.nodes['blockquote'],
    );
    this._editorView.dispatch(tr);
    this._editorView.focus();
  }

  public onTableClick(): void {
    const offset: number = this._editorView.state.tr.selection.anchor + 1;
    const transaction = this._editorView.state.tr;
    const cell: Node = this._editorView.state.schema.nodes[
      'table_cell'
    ].createAndFill() as unknown as Node;

    const node: Node = this._editorView.state.schema.nodes['table'].create(
      null,
      Fragment.fromArray([
        this._editorView.state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell]),
        ),
        this._editorView.state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell]),
        ),
      ]),
    ) as unknown as Node;

    this._editorView.dispatch(
      transaction
        .replaceSelectionWith(node)
        .scrollIntoView()
        .setSelection(TextSelection.near(transaction.doc.resolve(offset))),
    );
    this._editorView.focus();
  }

  public ngOnInit(): void {
    this.isScrollTop = this._editorView.dom.scrollTop === 0;
    this._subscriptions.push(
      fromEvent(this._editorView.dom, 'scroll')
        .pipe(
          tap(() => {
            this.isScrollTop = this._editorView.dom.scrollTop === 0;
          }),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
