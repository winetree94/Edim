/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  EditorState,
  PluginView,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from './menubar';
import {
  findParentNode,
  forEachParentNodes,
  getRangeTailNodes,
  lift,
  markActive,
  wrapIn,
} from 'prosemirror-preset-utils';
import { GlobalService } from 'src/app/global.service';
import { setBlockType, toggleMark } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProseButtonComponent } from 'src/app/components/button/prose-button.component';
import { ProseSeparatorComponent } from 'src/app/components/separator/prose-separator.component';
import { redo, undo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-preset-list';
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
      editorView.state.selection.from,
      editorView.state.schema.nodes['ordered_list'],
    );

    this.activeUnorderedList = !!findParentNode(
      editorView.state,
      editorView.state.selection.from,
      editorView.state.schema.nodes['bullet_list'],
    );

    this.canNormalText = this.getRangeNodes()
      .filter(
        (node) =>
          node.node.type.name === 'paragraph' ||
          node.node.type.name === 'heading',
      )
      .every((node) => {
        let isNormalText = true;
        forEachParentNodes(editorView.state, node.pos, (parent) => {
          if (
            ['bullet_list', 'ordered_list', 'blockquote'].includes(
              parent.type.name,
            )
          ) {
            isNormalText = false;
          }
        });
        return isNormalText;
      });

    const rangeFromNode = this._editorView.state.selection.$from.parent;

    this.activeParagraph =
      this.canNormalText && rangeFromNode.type.name === 'paragraph';

    this.activeH1 =
      this.canNormalText &&
      rangeFromNode.type.name === 'heading' &&
      rangeFromNode.attrs['level'] === 1;

    this.activeH2 = this.canNormalText &&
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

    this.activeAlignLeft =
      this.canNormalText && rangeFromNode.attrs['textAlign'] === 'left';

    this.activeAlignCenter =
      this.canNormalText && rangeFromNode.attrs['textAlign'] === 'center';

    this.activeAlignRight =
      this.canNormalText && rangeFromNode.attrs['textAlign'] === 'right';

    this.canAlign = this.getAlignmentAbleNodes().length > 0;
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

  public onAlignClick(alignment: 'left' | 'center' | 'right'): void {
    const alignmentAbleNodes = this.getAlignmentAbleNodes();

    const tr = alignmentAbleNodes.reduce<Transaction>((tr, node) => {
      return tr.setNodeMarkup(node.pos, undefined, {
        ...node.node.attrs,
        textAlign: alignment,
      });
    }, this._editorView.state.tr);

    if (tr.docChanged) {
      this._editorView.dispatch(tr);
    }

    this._editorView.focus();
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
        this._editorView.state.selection.from,
        this._editorView.state.schema.nodes['ordered_list'],
      )
    ) {
      const tr = wrapInList(
        this._editorView.state,
        lift(this._editorView.state, this._editorView.state.tr),
        this._editorView.state.schema.nodes['ordered_list'],
      );
      if (!tr) {
        return;
      }
      this._editorView.dispatch(tr);
      this._editorView.focus();
    } else if (
      findParentNode(
        this._editorView.state,
        this._editorView.state.selection.from,
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
      if (!tr) {
        return;
      }
      this._editorView.dispatch(tr);
      this._editorView.focus();
    }
  }

  public onUnorderedListClick(): void {
    // const isOrdered = findParentNode(
    //   this._editorView.state,
    //   this._editorView.state.selection.from,
    //   this._editorView.state.schema.nodes['ordered_list'],
    // );
    // if (isOrdered) {
    //   const tr = this._editorView.state.tr.setNodeMarkup(
    //     isOrdered.pos,
    //     this._editorView.state.schema.nodes['bullet_list'],
    //   );
    //   if (!tr) {
    //     return;
    //   }
    //   this._editorView.dispatch(tr);
    //   this._editorView.focus();
    // } else if (
    //   findParentNode(
    //     this._editorView.state,
    //     this._editorView.state.selection.from,
    //     this._editorView.state.schema.nodes['bullet_list'],
    //   )
    // ) {
    //   const tr = lift(this._editorView.state, this._editorView.state.tr);
    //   this._editorView.dispatch(tr);
    //   this._editorView.focus();
    //   return;
    // } else {
    //   const tr = wrapInList(
    //     this._editorView.state,
    //     this._editorView.state.tr,
    //     this._editorView.state.schema.nodes['bullet_list'],
    //   );
    //   if (!tr) {
    //     return;
    //   }
    //   this._editorView.dispatch(tr);
    //   this._editorView.focus();
    // }
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

  private getRangeNodes() {
    const { from, to } = this._editorView.state.selection;

    const nodes: {
      node: Node;
      parent: Node | null;
      pos: number;
    }[] = [];

    this._editorView.state.doc.nodesBetween(from, to, (node, pos, parent) => {
      nodes.push({ node, parent, pos });
    });

    return nodes;
  }

  private getAlignmentAbleNodes() {
    return this.getRangeNodes().filter((node) => {
      if (
        node.node.type.name !== 'paragraph' &&
        node.node.type.name !== 'heading'
      ) {
        return false;
      }
      let alignmentAble = true;
      forEachParentNodes(this._editorView.state, node.pos, (parent) => {
        if (
          ['bullet_list', 'ordered_list', 'blockquote'].includes(
            parent.type.name,
          )
        ) {
          alignmentAble = false;
        }
      });
      return alignmentAble;
    });
  }
}
