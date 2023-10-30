/* eslint-disable @typescript-eslint/unbound-method */
import { PmpSeparator } from './components/separator';
import { PmpButton } from './components/button';
import { render } from 'preact';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { setBlockType, toggleMark } from 'prosemirror-commands';
import { indentListItem, toggleList } from 'prosemirror-preset-free-list';
import { addMention } from 'prosemirror-preset-mention';
import { toggleBlockquote } from 'prosemirror-preset-blockquote';
import { findParentNode, markActive } from 'prosemirror-preset-utils';
import {
  getRangeFirstAlignment,
  getRangeIsText,
  setAlignment,
} from 'prosemirror-preset-paragraph';
import { addLink, canAddLink } from 'prosemirror-preset-link';
import { redo, undo } from 'prosemirror-history';
import { insertTable } from 'prosemirror-preset-tables';

{
  /* <div class="wrapper" [class.scroll-top]="isScrollTop">
  <button prose-button (click)="onUndoClick()" [disabled]="!canUndo">
    <i class="ri-arrow-go-back-line"></i>
  </button>
  <button prose-button (click)="onRedoClick()" [disabled]="!canRedo">
    <i class="ri-arrow-go-forward-line"></i>
  </button>

  <prose-separator class="separator" />

  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeParagraph"
    (click)="onParagraphClick()"
  >
    <i class="ri-text"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH1"
    (click)="onHeadingClick(1)"
  >
    <i class="ri-h-1"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH2"
    (click)="onHeadingClick(2)"
  >
    <i class="ri-h-2"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH3"
    (click)="onHeadingClick(3)"
  >
    <i class="ri-h-3"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH4"
    (click)="onHeadingClick(4)"
  >
    <i class="ri-h-4"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH5"
    (click)="onHeadingClick(5)"
  >
    <i class="ri-h-5"></i>
  </button>
  <button
    prose-button
    [disabled]="!canNormalText"
    [class.active]="activeH6"
    (click)="onHeadingClick(6)"
  >
    <i class="ri-h-6"></i>
  </button>

  <prose-separator class="separator" />

  <button
    prose-button
    [class.active]="activeBold"
    (click)="toggleBold()"
    title="toggle bold"
  >
    <i class="ri-bold"></i>
  </button>
  <button
    prose-button
    [class.active]="activeItalic"
    (click)="toggleItalic()"
    title="toggle italic"
  >
    <i class="ri-italic"></i>
  </button>
  <button
    prose-button
    [class.active]="activeStrikethrough"
    (click)="toggleStrikethrough()"
    title="toggle strikethrough"
  >
    <i class="ri-strikethrough-2"></i>
  </button>
  <button
    prose-button
    [class.active]="activeInlineCode"
    (click)="toggleInlineCode()"
    title="toggle code"
  >
    <i class="ri-code-line"></i>
  </button>
  <button
    #colorButton
    prose-button
    [class.active]="false"
    (click)="onTextColorClick(colorButton.elementRef.nativeElement)"
  >
    <i class="ri-font-color"></i>
  </button>

  <prose-separator class="separator" />

  <button
    prose-button
    title="toggle code"
    [disabled]="!canAlign"
    [class.active]="activeAlignLeft"
    (click)="onAlignClick('left')"
  >
    <i class="ri-align-left"></i>
  </button>
  <button
    prose-button
    title="toggle code"
    [disabled]="!canAlign"
    [class.active]="activeAlignCenter"
    (click)="onAlignClick('center')"
  >
    <i class="ri-align-center"></i>
  </button>
  <button
    prose-button
    title="toggle code"
    [disabled]="!canAlign"
    [class.active]="activeAlignRight"
    (click)="onAlignClick('right')"
  >
    <i class="ri-align-right"></i>
  </button>

  <prose-separator class="separator" />

  <button
    prose-button
    [class.active]="activeOrderedList"
    [disabled]="!canOrderedList"
    (click)="onOrderedListClick()"
  >
    <i class="ri-list-ordered"></i>
  </button>
  <button
    prose-button
    [class.active]="activeUnorderedList"
    [disabled]="!canBulletList"
    (click)="onUnorderedListClick()"
  >
    <i class="ri-list-unordered"></i>
  </button>
  <button
    prose-button
    [disabled]="!canDeindent"
    (click)="onDecreaseIndentClick()"
  >
    <i class="ri-indent-decrease"></i>
  </button>
  <button
    prose-button
    [disabled]="!canIndent"
    (click)="onIncreaseIndentClick()"
  >
    <i class="ri-indent-increase"></i>
  </button>

  <prose-separator class="separator" />

  <button prose-button disabled>
    <i class="ri-checkbox-line"></i>
  </button>
  <button prose-button [disabled]="!canLink" (click)="setLink()">
    <i class="ri-links-line"></i>
  </button>
  <button prose-button (click)="onImageClick()">
    <i class="ri-image-line"></i>
  </button>
  <button prose-button [disabled]="!canMention" (click)="onMentionClick()">
    <i class="ri-at-line"></i>
  </button>
  <button prose-button (click)="onBlockQuoteClick()">
    <i class="ri-double-quotes-l"></i>
  </button>
  <button prose-button disabled>
    <i class="ri-emoji-sticker-line"></i>
  </button>
  <button prose-button (click)="onTableClick()">
    <i class="ri-table-2"></i>
  </button>
  <button prose-button disabled>
    <i class="ri-code-s-slash-fill"></i>
  </button>
  <button
    #commandButton
    prose-button
    (click)="onCommandClick(commandButton.elementRef.nativeElement)"
  >
    <i class="ri-slash-commands"></i>
  </button>
</div>

<div #reactRoot></div>
<div #reactRoot2></div>
<ng-container #layerRoot></ng-container> */
}

export interface PmpMenubarProps {
  isScrolltop: boolean;
  activeBold: boolean;
  activeItalic: boolean;
  activeStrikethrough: boolean;
  activeInlineCode: boolean;
  activeOrderedList: boolean;
  activeUnorderedList: boolean;
  activeParagraph: boolean;
  activeH1: boolean;
  activeH2: boolean;
  activeH3: boolean;
  activeH4: boolean;
  activeH5: boolean;
  activeH6: boolean;
  activeAlignLeft: boolean;
  activeAlignCenter: boolean;
  activeAlignRight: boolean;
  canNormalText: boolean;
  canAlign: boolean;
  canOrderedList: boolean;
  canBulletList: boolean;
  canLink: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canIndent: boolean;
  canDeindent: boolean;
  canMention: boolean;

  onUndoClick(): void;
  onRedoClick(): void;
  onParagraphClick(): void;
  onHeadingClick(level: number): void;
  toggleBold(): void;
  toggleItalic(): void;
  toggleStrikethrough(): void;
  toggleInlineCode(): void;
  setLink(): void;
  onAlignClick(alignment: 'left' | 'center' | 'right'): void;
  onOrderedListClick(): void;
  onUnorderedListClick(): void;
  onIncreaseIndentClick(): void;
  onDecreaseIndentClick(): void;
  onImageClick(): void;
  onMentionClick(): void;
  onBlockQuoteClick(): void;
  onTableClick(): void;
  onCommandClick(commandInput: HTMLButtonElement): void;
}

export const PmpMenubar = (props: PmpMenubarProps) => {
  return (
    <div className="pmp-view-menubar-wrapper">
      <PmpButton disabled={!props.canUndo} onClick={() => props.onUndoClick()}>
        <i className="ri-arrow-go-back-line" />
      </PmpButton>
      <PmpButton disabled={!props.canRedo} onClick={() => props.onRedoClick()}>
        <i className="ri-arrow-go-forward-line" />
      </PmpButton>
      <PmpSeparator className="pmp-view-menubar-separator" />

      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeParagraph ? 'selected' : ''}
        onClick={() => props.onParagraphClick()}
      >
        <i className="ri-text" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH1 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(1)}
      >
        <i className="ri-h-1" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH2 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(2)}
      >
        <i className="ri-h-2" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH3 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(3)}
      >
        <i className="ri-h-3" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH4 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(4)}
      >
        <i className="ri-h-4" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH5 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(5)}
      >
        <i className="ri-h-5" />
      </PmpButton>
      <PmpButton
        disabled={!props.canNormalText}
        className={props.activeH6 ? 'selected' : ''}
        onClick={() => props.onHeadingClick(6)}
      >
        <i className="ri-h-6" />
      </PmpButton>
      <PmpSeparator className="pmp-view-menubar-separator" />

      <PmpButton
        className={props.activeBold ? 'selected' : ''}
        onClick={() => props.toggleBold()}
      >
        <i className="ri-bold" />
      </PmpButton>
      <PmpButton
        className={props.activeItalic ? 'selected' : ''}
        onClick={() => props.toggleItalic()}
      >
        <i className="ri-italic" />
      </PmpButton>
      <PmpButton
        className={props.activeStrikethrough ? 'selected' : ''}
        onClick={() => props.toggleStrikethrough()}
      >
        <i className="ri-strikethrough-2" />
      </PmpButton>
      <PmpButton
        className={props.activeInlineCode ? 'selected' : ''}
        onClick={() => props.toggleInlineCode()}
      >
        <i className="ri-code-line" />
      </PmpButton>
      <PmpButton>
        <i className="ri-font-color" />
      </PmpButton>
      <PmpSeparator className="pmp-view-menubar-separator" />

      <PmpButton
        disabled={!props.canAlign}
        className={props.activeAlignLeft ? 'selected' : ''}
        onClick={() => props.onAlignClick('left')}
      >
        <i className="ri-align-left" />
      </PmpButton>
      <PmpButton
        disabled={!props.canAlign}
        className={props.activeAlignCenter ? 'selected' : ''}
        onClick={() => props.onAlignClick('center')}
      >
        <i className="ri-align-center" />
      </PmpButton>
      <PmpButton
        disabled={!props.canAlign}
        className={props.activeAlignRight ? 'selected' : ''}
        onClick={() => props.onAlignClick('right')}
      >
        <i className="ri-align-right" />
      </PmpButton>
      <PmpSeparator className="pmp-view-menubar-separator" />

      <PmpButton
        className={props.activeOrderedList ? 'selected' : ''}
        disabled={!props.canOrderedList}
        onClick={() => props.onOrderedListClick()}
      >
        <i className="ri-list-ordered" />
      </PmpButton>
      <PmpButton
        className={props.activeUnorderedList ? 'selected' : ''}
        disabled={!props.canBulletList}
        onClick={() => props.onUnorderedListClick()}
      >
        <i className="ri-list-unordered" />
      </PmpButton>
      <PmpButton
        disabled={!props.canDeindent}
        onClick={() => props.onDecreaseIndentClick()}
      >
        <i className="ri-indent-decrease" />
      </PmpButton>
      <PmpButton
        disabled={!props.canIndent}
        onClick={() => props.onIncreaseIndentClick()}
      >
        <i className="ri-indent-increase" />
      </PmpButton>
      <PmpSeparator className="pmp-view-menubar-separator" />

      <PmpButton disabled={true}>
        <i className="ri-checkbox-line" />
      </PmpButton>
      <PmpButton disabled={!props.canLink} onClick={() => props.setLink()}>
        <i className="ri-links-line" />
      </PmpButton>
      <PmpButton
        onClick={() => {
          props.onImageClick();
        }}
      >
        <i className="ri-image-line" />
      </PmpButton>
      <PmpButton
        disabled={!props.canMention}
        onClick={() => {
          props.onMentionClick();
        }}
      >
        <i className="ri-at-line" />
      </PmpButton>
      <PmpButton
        onClick={() => {
          props.onBlockQuoteClick();
        }}
      >
        <i className="ri-double-quotes-l" />
      </PmpButton>
      <PmpButton disabled={true}>
        <i className="ri-emoji-sticker-line" />
      </PmpButton>
      <PmpButton
        onClick={() => {
          props.onTableClick();
        }}
      >
        <i className="ri-table-2" />
      </PmpButton>
      <PmpButton disabled={true}>
        <i className="ri-code-s-slash-fill" />
      </PmpButton>
      <PmpButton
        onClick={() => {
          // props.onCommandClick();
        }}
      >
        <i className="ri-slash-commands" />
      </PmpButton>
    </div>
  );
};

export class PmpMenubarView implements PluginView {
  public readonly wrapper = document.createElement('div');

  private readonly _toggleBold = toggleMark(
    this.editorView.state.schema.marks['strong'],
  );
  private readonly _toggleItalic = toggleMark(
    this.editorView.state.schema.marks['em'],
  );
  private readonly _toggleStrikethrough = toggleMark(
    this.editorView.state.schema.marks['strikethrough'],
  );
  private readonly _toggleInlineCode = toggleMark(
    this.editorView.state.schema.marks['code'],
  );
  private readonly _toggleOrderedList = toggleList(
    this.editorView.state.schema.nodes['ordered_list'],
  );
  private readonly _toggleBulletList = toggleList(
    this.editorView.state.schema.nodes['bullet_list'],
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

  public constructor(private readonly editorView: EditorView) {
    this.render();
    this.editorView.dom.parentNode?.parentNode?.parentNode?.insertBefore(
      this.wrapper,
      this.editorView.dom.parentNode.parentNode,
    );
    const scrollbarElement = editorView.dom.parentElement!.parentElement!;
    this.isScrollTop = scrollbarElement.scrollTop === 0;
    scrollbarElement?.addEventListener('scroll', () => {
      this.isScrollTop = scrollbarElement.scrollTop === 0;
    });
  }

  public update(editorView: EditorView, prevState: EditorState) {
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

    this.canOrderedList = this._toggleOrderedList(editorView.state);
    this.canBulletList = this._toggleBulletList(editorView.state);

    this.activeOrderedList =
      this.canOrderedList &&
      !!findParentNode(
        editorView.state,
        editorView.state.selection.from,
        (node) => node.type === editorView.state.schema.nodes['ordered_list'],
      );

    this.activeUnorderedList =
      this.canBulletList &&
      !!findParentNode(
        editorView.state,
        editorView.state.selection.from,
        (node) => node.type === editorView.state.schema.nodes['bullet_list'],
      );

    this.canNormalText = getRangeIsText(editorView.state);
    const rangeFromNode = editorView.state.selection.$from.parent;

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

    const firstAlignment = getRangeFirstAlignment(editorView.state);
    this.activeAlignLeft = firstAlignment === 'left';
    this.activeAlignCenter = firstAlignment === 'center';
    this.activeAlignRight = firstAlignment === 'right';
    this.canAlign = firstAlignment !== null;

    this.canIndent = this._indent(editorView.state);
    this.canDeindent = this._deindent(editorView.state);

    this.canLink = canAddLink(editorView.state);
    this.canMention = this._addMention(editorView.state);

    this.canUndo = undo(editorView.state);
    this.canRedo = redo(editorView.state);
    this.render();
  }

  public render() {
    render(
      <PmpMenubar
        isScrolltop={this.isScrollTop}
        activeBold={this.activeBold}
        activeItalic={this.activeItalic}
        activeStrikethrough={this.activeStrikethrough}
        activeInlineCode={this.activeInlineCode}
        activeOrderedList={this.activeOrderedList}
        activeUnorderedList={this.activeUnorderedList}
        activeParagraph={this.activeParagraph}
        activeH1={this.activeH1}
        activeH2={this.activeH2}
        activeH3={this.activeH3}
        activeH4={this.activeH4}
        activeH5={this.activeH5}
        activeH6={this.activeH6}
        activeAlignLeft={this.activeAlignLeft}
        activeAlignCenter={this.activeAlignCenter}
        activeAlignRight={this.activeAlignRight}
        canNormalText={this.canNormalText}
        canAlign={this.canAlign}
        canOrderedList={this.canOrderedList}
        canBulletList={this.canBulletList}
        canLink={this.canLink}
        canUndo={this.canUndo}
        canRedo={this.canRedo}
        canIndent={this.canIndent}
        canDeindent={this.canDeindent}
        canMention={this.canMention}
        onUndoClick={() => this.onUndoClick()}
        onRedoClick={() => this.onRedoClick()}
        onParagraphClick={() => this.onParagraphClick()}
        onHeadingClick={(level) => this.onHeadingClick(level)}
        toggleBold={() => this.toggleBold()}
        toggleItalic={() => this.toggleItalic()}
        toggleStrikethrough={() => this.toggleStrikethrough()}
        toggleInlineCode={() => this.toggleInlineCode()}
        onAlignClick={(alignment) => this.onAlignClick(alignment)}
        onOrderedListClick={() => this.onOrderedListClick()}
        onUnorderedListClick={() => this.onUnorderedListClick()}
        onIncreaseIndentClick={() => this.onIncreaseIndentClick()}
        onDecreaseIndentClick={() => this.onDecreaseIndentClick()}
        setLink={() => this.setLink()}
        onImageClick={() => this.onImageClick()}
        onMentionClick={() => this.onMentionClick()}
        onBlockQuoteClick={() => this.onBlockQuoteClick()}
        onTableClick={() => this.onTableClick()}
        onCommandClick={(commandInput) => this.onCommandClick(commandInput)}
      />,
      this.wrapper,
    );
  }

  public onParagraphClick(): void {
    setBlockType(this.editorView.state.schema.nodes['paragraph'])(
      this.editorView.state,
      this.editorView.dispatch,
    );
    this.editorView.focus();
  }

  public onHeadingClick(level: number): void {
    setBlockType(this.editorView.state.schema.nodes['heading'], {
      level,
    })(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public toggleBold(): void {
    this._toggleBold(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public toggleItalic(): void {
    this._toggleItalic(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public toggleStrikethrough(): void {
    this._toggleStrikethrough(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public toggleInlineCode(): void {
    this._toggleInlineCode(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public setLink(): void {
    const { from, to } = this.editorView.state.selection;
    const start = this.editorView.coordsAtPos(from);
    const end = this.editorView.coordsAtPos(to);
    // this._linkRef = this._preactRenderer(
    //   h(
    //     PmpLayer,
    //     {
    //       top: end.bottom + 10,
    //       left: start.left,
    //       closeOnEsc: true,
    //       outerMousedown: () => this._linkRef?.destroy(),
    //       onClose: () => this._linkRef?.destroy(),
    //     },
    //     [
    //       h(PmpLinkFormLayer, {
    //         text: this._editorView.state.doc.textBetween(from, to),
    //         link: '',
    //         onSubmit: (link: string, text: string) => {
    //           let tr = this._editorView.state.tr;
    //           this._linkRef?.destroy();
    //           tr = addLink(tr, from, to, text, link);
    //           this._editorView.dispatch(tr);
    //           this._editorView.focus();
    //         },
    //         onCancel: () => this._linkRef?.destroy(),
    //       }),
    //     ],
    //   ),
    //   this._linkRef?.parent,
    // );
  }

  public onAlignClick(alignment: 'left' | 'center' | 'right'): void {
    setAlignment(alignment)(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onUndoClick(): void {
    undo(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onRedoClick(): void {
    redo(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onOrderedListClick(): void {
    this._toggleOrderedList(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onUnorderedListClick(): void {
    this._toggleBulletList(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onIncreaseIndentClick(): void {
    this._indent(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onDecreaseIndentClick(): void {
    this._deindent(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onImageClick(): void {
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = 'image/*';
    // input.multiple = true;
    // input.hidden = true;
    // input.value = '';
    // document.body.appendChild(input);

    // const originSelection = this._editorView.state.selection;

    // this._subscriptions.push(
    //   merge(
    //     fromEvent(input, 'change').pipe(
    //       switchMap((event) => {
    //         return from(
    //           imageFileToBase64Url(
    //             (event.target as HTMLInputElement).files![0],
    //           ),
    //         ).pipe(
    //           switchMap((url) =>
    //             from(parseImageMeta(url)).pipe(
    //               switchMap((image) => {
    //                 const id = Math.random().toString();
    //                 let tr = this._editorView.state.tr;

    //                 const adjacentInsertableParent = findParentNode(
    //                   this._editorView.state,
    //                   originSelection.from,
    //                   (node, parent) => {
    //                     return (
    //                       parent?.type.spec.group?.includes(
    //                         'block-container',
    //                       ) || false
    //                     );
    //                   },
    //                 );

    //                 const insertPos = adjacentInsertableParent
    //                   ? adjacentInsertableParent.pos +
    //                     adjacentInsertableParent.node.nodeSize
    //                   : 0;

    //                 tr = tr.setMeta(imagePlaceholderPluginKey, {
    //                   type: 'add',
    //                   id: id,
    //                   pos: insertPos,
    //                   progress: 0,
    //                   text_align: 'center',
    //                   width: image.width,
    //                   height: image.height,
    //                   viewport_width: 80,
    //                 } as ImagePlaceholderAddAction);
    //                 this._editorView.dispatch(tr);

    //                 return this.fakeProgress().pipe(
    //                   tap((progress) => {
    //                     let tr = this._editorView.state.tr;

    //                     tr = tr.setMeta(imagePlaceholderPluginKey, {
    //                       type: 'update',
    //                       id: id,
    //                       progress: progress,
    //                     } as ImagePlaceholderUpdateAction);
    //                     this._editorView.dispatch(tr);

    //                     if (progress >= 1) {
    //                       const pos = findPlaceholderPos(
    //                         this._editorView.state,
    //                         id,
    //                       );
    //                       if (!pos) {
    //                         return;
    //                       }
    //                       tr = tr.setMeta(imagePlaceholderPluginKey, {
    //                         type: 'remove',
    //                         id: id,
    //                       } as ImagePlaceholderRemoveAction);
    //                       const node = this._editorView.state.schema.nodes[
    //                         'image'
    //                       ].create({
    //                         src: url,
    //                       });
    //                       tr = tr.replaceWith(pos, pos, node);
    //                       this._editorView.dispatch(tr);
    //                     }
    //                   }),
    //                 );
    //               }),
    //             ),
    //           ),
    //         );
    //       }),
    //     ),
    //   ).subscribe(),
    // );
    // input.click();
    return;
  }

  // public fakeProgress(): Observable<number> {
  //   return new Observable((subscriber) => {
  //     let progress = 0;
  //     const interval = setInterval(() => {
  //       progress += 0.1;
  //       subscriber.next(progress);
  //       if (progress >= 1) {
  //         clearInterval(interval);
  //         subscriber.complete();
  //       }
  //     }, 500);
  //   });
  // }

  public onMentionClick(): void {
    this._addMention(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onBlockQuoteClick(): void {
    this._toggleBlockQuote(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onTableClick(): void {
    insertTable()(this.editorView.state, this.editorView.dispatch);
    this.editorView.focus();
  }

  public onTextColorClick(colorInput: HTMLButtonElement): void {
    const { left, bottom } = colorInput.getBoundingClientRect();
    const { from, to } = this.editorView.state.tr.selection;
    // this._colorPickerRef = this._preactRenderer(
    //   h(
    //     PmpLayer,
    //     {
    //       top: bottom + 10,
    //       left: left,
    //       closeOnEsc: true,
    //       outerMousedown: () => this._colorPickerRef?.destroy(),
    //       onClose: () => this._colorPickerRef?.destroy(),
    //     },
    //     [
    //       h(PmpColorPicker, {
    //         onChange: (color: string) => {
    //           if (from === to) {
    //             this._colorPickerRef?.destroy();
    //             toggleMark(this._editorView.state.schema.marks['textColor'], {
    //               color: color,
    //             })(this._editorView.state, this._editorView.dispatch);
    //             this._editorView.focus();
    //             return;
    //           }
    //           let tr = this._editorView.state.tr;
    //           this._colorPickerRef?.destroy();
    //           tr = tr.addMark(
    //             from,
    //             to,
    //             this._editorView.state.schema.marks['textColor'].create({
    //               color,
    //             }),
    //           );
    //           this._editorView.dispatch(tr);
    //           this._editorView.focus();
    //         },
    //       }),
    //     ],
    //   ),
    //   this._colorPickerRef?.parent,
    // );
  }

  public onCommandClick(button: HTMLButtonElement): void {
    const { left, bottom } = button.getBoundingClientRect();
    // this._commandRef = this._preactRenderer(
    //   h(
    //     PmpLayer,
    //     {
    //       top: bottom + 10,
    //       left: left,
    //       closeOnEsc: true,
    //       outerMousedown: () => {
    //         this._commandRef?.destroy();
    //         this._commandIndex = 0;
    //       },
    //       onClose: () => {
    //         this._commandRef?.destroy();
    //         this._commandIndex = 0;
    //       },
    //     },
    //     [
    //       h(PmpCommand, {
    //         items: PMP_DEFAULT_COMMAND_LIST,
    //         keyword: '',
    //         selectedIndex: this._commandIndex,
    //         onHover: (index) => {
    //           this._commandIndex = index;
    //           this.onCommandClick(button);
    //         },
    //         onClick: (index: number) => {
    //           this._commandRef?.destroy();
    //           PMP_DEFAULT_COMMAND_LIST[index].action(this._editorView, true);
    //           this._editorView.focus();
    //         },
    //       }),
    //     ],
    //   ),
    //   this._commandRef?.parent,
    // );
  }

  public destroy() {
    render(null, this.wrapper);
  }
}

export const PmpMenubarPlugin = new Plugin({
  key: new PluginKey('pmp-menubar'),
  view: (editorView) => new PmpMenubarView(editorView),
});
