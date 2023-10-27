/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { EditorState, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from './menubar';
import { findParentNode, markActive } from 'prosemirror-preset-utils';
import { setBlockType, toggleMark } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProseButtonComponent } from 'src/app/components/button/prose-button.component';
import { ProseSeparatorComponent } from 'src/app/components/separator/prose-separator.component';
import { redo, undo } from 'prosemirror-history';
import { SubscriptionLike, fromEvent, merge, take, tap } from 'rxjs';
import { indentListItem, toggleList } from 'prosemirror-preset-free-list';
import {
  getRangeFirstAlignment,
  getRangeIsText,
  setAlignment,
} from 'prosemirror-preset-paragraph';
import { ProseEditorLinkLayerComponent } from 'src/app/components/prose-editor/link/link-layer.component';
import { h } from 'preact';
import { PreactRef, usePreactRenderer } from 'src/app/components/preact/preact';
import {
  PMP_DEFAULT_COMMAND_LIST,
  PmpColorPicker,
  PmpCommand,
  PmpLayer,
  PmpLinkFormLayer,
} from 'prosemirror-preset-view';
import { addLink, canAddLink } from 'prosemirror-preset-link';
import { toggleBlockquote } from 'prosemirror-preset-blockquote';
import { addMention } from 'prosemirror-preset-mention';
import { insertTable } from 'prosemirror-preset-tables';

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
    ProseEditorLinkLayerComponent,
  ],
})
export class ProseEditorMenubarComponent
  implements OnInit, OnDestroy, PluginView
{
  private readonly _preactRenderer = usePreactRenderer();
  private readonly _subscriptions: SubscriptionLike[] = [];
  private readonly _editorView = inject(ProseMirrorEditorView);

  private _linkRef: PreactRef | null = null;
  private _colorPickerRef: PreactRef | null = null;
  private _commandRef: PreactRef | null = null;
  private _commandIndex = 0;

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
  private readonly _toggleOrderedList = toggleList(
    this._editorView.state.schema.nodes['ordered_list'],
  );
  private readonly _toggleBulletList = toggleList(
    this._editorView.state.schema.nodes['bullet_list'],
  );
  private readonly _addMention = addMention();
  private readonly _toggleBlockQuote = toggleBlockquote();
  private readonly _indent = indentListItem(1);
  private readonly _deindent = indentListItem(-1);

  public isScrollTop = false;

  public activeBold = false;
  public activeItalic = false;
  public activeStrikethrough = false;
  public activeInlineCode = false;
  public activeOrderedList = false;
  public activeUnorderedList = false;
  public activeParagraph = false;
  public activeH1 = false;
  public activeH2 = false;
  public activeH3 = false;
  public activeH4 = false;
  public activeH5 = false;
  public activeH6 = false;

  public activeAlignLeft = false;
  public activeAlignCenter = false;
  public activeAlignRight = false;

  public canNormalText = false;
  public canAlign = false;
  public canOrderedList = true;
  public canBulletList = true;
  public canLink = false;
  public canUndo = false;
  public canRedo = false;
  public canIndent = false;
  public canDeindent = false;
  public canMention = false;

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

    this.canOrderedList = this._toggleOrderedList(this._editorView.state);
    this.canBulletList = this._toggleBulletList(this._editorView.state);

    this.activeOrderedList =
      this.canOrderedList &&
      !!findParentNode(
        editorView.state,
        editorView.state.selection.from,
        editorView.state.schema.nodes['ordered_list'],
      );

    this.activeUnorderedList =
      this.canBulletList &&
      !!findParentNode(
        editorView.state,
        editorView.state.selection.from,
        editorView.state.schema.nodes['bullet_list'],
      );

    this.canNormalText = getRangeIsText(this._editorView.state);
    const rangeFromNode = this._editorView.state.selection.$from.parent;

    this.activeParagraph =
      this.canNormalText && rangeFromNode.type.name === 'paragraph';

    this.activeH1 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 1;

    this.activeH2 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 2;

    this.activeH3 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 3;

    this.activeH4 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 4;

    this.activeH5 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 5;

    this.activeH6 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 6;

    const firstAlignment = getRangeFirstAlignment(this._editorView.state);
    this.activeAlignLeft = firstAlignment === 'left';
    this.activeAlignCenter = firstAlignment === 'center';
    this.activeAlignRight = firstAlignment === 'right';
    this.canAlign = firstAlignment !== null;

    this.canIndent = this._indent(this._editorView.state);
    this.canDeindent = this._deindent(this._editorView.state);

    this.canLink = canAddLink(this._editorView.state);
    this.canMention = this._addMention(this._editorView.state);

    this.canUndo = undo(editorView.state);
    this.canRedo = redo(editorView.state);
  }

  public onParagraphClick(): void {
    setBlockType(this._editorView.state.schema.nodes['paragraph'])(
      this._editorView.state,
      this._editorView.dispatch,
    );
    this._editorView.focus();
  }

  public onHeadingClick(level: number): void {
    setBlockType(this._editorView.state.schema.nodes['heading'], {
      level,
    })(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
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
    const { from, to } = this._editorView.state.selection;
    const start = this._editorView.coordsAtPos(from);
    const end = this._editorView.coordsAtPos(to);
    this._linkRef = this._preactRenderer(
      h(
        PmpLayer,
        {
          top: end.bottom + 10,
          left: start.left,
          closeOnEsc: true,
          outerMousedown: () => this._linkRef?.destroy(),
          onClose: () => this._linkRef?.destroy(),
        },
        [
          h(PmpLinkFormLayer, {
            text: this._editorView.state.doc.textBetween(from, to),
            link: '',
            onSubmit: (link: string, text: string) => {
              let tr = this._editorView.state.tr;
              this._linkRef?.destroy();
              tr = addLink(tr, from, to, text, link);
              this._editorView.dispatch(tr);
              this._editorView.focus();
            },
            onCancel: () => this._linkRef?.destroy(),
          }),
        ],
      ),
      this._linkRef?.parent,
    );
  }

  public onAlignClick(alignment: 'left' | 'center' | 'right'): void {
    setAlignment(alignment)(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
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
    this._toggleOrderedList(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onUnorderedListClick(): void {
    this._toggleBulletList(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onIncreaseIndentClick(): void {
    this._indent(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onDecreaseIndentClick(): void {
    this._deindent(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
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
    this._addMention(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onBlockQuoteClick(): void {
    this._toggleBlockQuote(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onTableClick(): void {
    insertTable()(this._editorView.state, this._editorView.dispatch);
    this._editorView.focus();
  }

  public onTextColorClick(colorInput: HTMLButtonElement): void {
    const { left, bottom } = colorInput.getBoundingClientRect();
    const { from, to } = this._editorView.state.tr.selection;
    this._colorPickerRef = this._preactRenderer(
      h(
        PmpLayer,
        {
          top: bottom + 10,
          left: left,
          closeOnEsc: true,
          outerMousedown: () => this._colorPickerRef?.destroy(),
          onClose: () => this._colorPickerRef?.destroy(),
        },
        [
          h(PmpColorPicker, {
            onChange: (color: string) => {
              if (from === to) {
                this._colorPickerRef?.destroy();
                toggleMark(this._editorView.state.schema.marks['textColor'], {
                  color: color,
                })(this._editorView.state, this._editorView.dispatch);
                this._editorView.focus();
                return;
              }
              let tr = this._editorView.state.tr;
              this._colorPickerRef?.destroy();
              tr = tr.addMark(
                from,
                to,
                this._editorView.state.schema.marks['textColor'].create({
                  color,
                }),
              );
              this._editorView.dispatch(tr);
              this._editorView.focus();
            },
          }),
        ],
      ),
      this._colorPickerRef?.parent,
    );
  }

  public onCommandClick(button: HTMLButtonElement): void {
    const { left, bottom } = button.getBoundingClientRect();
    this._commandRef = this._preactRenderer(
      h(
        PmpLayer,
        {
          top: bottom + 10,
          left: left,
          closeOnEsc: true,
          outerMousedown: () => {
            this._commandRef?.destroy();
            this._commandIndex = 0;
          },
          onClose: () => {
            this._commandRef?.destroy();
            this._commandIndex = 0;
          },
        },
        [
          h(PmpCommand, {
            items: PMP_DEFAULT_COMMAND_LIST,
            keyword: '',
            selectedIndex: this._commandIndex,
            onHover: (index) => {
              this._commandIndex = index;
              this.onCommandClick(button);
            },
            onClick: (index: number) => {
              this._commandRef?.destroy();
              PMP_DEFAULT_COMMAND_LIST[index].action(this._editorView, true);
              this._editorView.focus();
            },
          }),
        ],
      ),
      this._commandRef?.parent,
    );
  }

  public ngOnInit(): void {
    const scrollbarElement = this._editorView.dom.parentElement!.parentElement!;
    this.isScrollTop = scrollbarElement.scrollTop === 0;
    this._subscriptions.push(
      fromEvent(scrollbarElement, 'scroll')
        .pipe(
          tap(() => {
            this.isScrollTop = scrollbarElement.scrollTop === 0;
          }),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
