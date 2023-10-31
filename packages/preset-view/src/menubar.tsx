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
import { PmpLayer } from './view';
import { useRef, useState } from 'preact/hooks';
import { PmpColorPicker } from './color-picker';
import { PmpLinkFormLayer } from './link';
import { PMP_DEFAULT_COMMAND_LIST, PmpCommand } from './command';
import { PmpInput } from './components/input';
import { TargetedEvent } from 'preact/compat';
import {
  ImagePlaceholderAddAction,
  ImagePlaceholderRemoveAction,
  ImagePlaceholderUpdateAction,
  findPlaceholderPos,
  imageFileToBase64Url,
  imagePlaceholderPluginKey,
  parseImageMeta,
} from 'prosemirror-preset-image';
import { classes } from './cdk/core';

export interface PmpMenubarProps {
  editorView: EditorView;
  editorState: EditorState;
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
  onTextColorClick(color: string): void;
  setLink(from: number, to: number, text: string, link: string): void;
  onAlignClick(alignment: 'left' | 'center' | 'right'): void;
  onOrderedListClick(): void;
  onUnorderedListClick(): void;
  onIncreaseIndentClick(): void;
  onDecreaseIndentClick(): void;
  onMentionClick(): void;
  onBlockQuoteClick(): void;
  onTableClick(): void;
}

const createFakeProgress = (
  progressChange: (progress: number) => void,
): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      progressChange(progress);
      if (progress >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

export const PmpMenubar = (props: PmpMenubarProps) => {
  const [textColorLayerRef, setTextColorLayerRef] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [linkLayerRef, setLinkLayerRef] = useState<{
    top: number;
    left: number;
    from: number;
    to: number;
    link: string;
    text: string;
  } | null>(null);

  const [commandLayerRef, setCommandLayerRef] = useState<{
    top: number;
    left: number;
    selectedIndex: number;
  } | null>(null);

  const textColorButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const commandButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onImageChange = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    const target = e.target as HTMLInputElement;
    const imageFiles = await Promise.all(
      Array.from(target.files || []).map((file) =>
        imageFileToBase64Url(file).then((url) =>
          parseImageMeta(url).then((image) => ({
            url,
            image,
          })),
        ),
      ),
    );

    await Promise.all(
      imageFiles.map(async (file) => {
        const id = Math.random().toString();
        let tr = props.editorView.state.tr;

        const adjacentInsertableParent = findParentNode(
          props.editorView.state,
          props.editorView.state.selection.from,
          (node, parent) => {
            return (
              parent?.type.spec.group?.includes('block-container') || false
            );
          },
        );

        const insertPos = adjacentInsertableParent
          ? adjacentInsertableParent.pos +
            adjacentInsertableParent.node.nodeSize
          : 0;

        tr.setMeta(imagePlaceholderPluginKey, {
          type: 'add',
          id,
          pos: insertPos,
          progress: 0,
          text_align: 'center',
          width: file.image.width,
          height: file.image.height,
          viewport_width: 80,
        } as ImagePlaceholderAddAction);

        props.editorView.dispatch(tr);

        await createFakeProgress((progress) => {
          let tr = props.editorView.state.tr;
          tr = tr.setMeta(imagePlaceholderPluginKey, {
            type: 'update',
            id,
            progress,
          } as ImagePlaceholderUpdateAction);
          props.editorView.dispatch(tr);
        });

        const pos = findPlaceholderPos(props.editorView.state, id);
        tr = props.editorView.state.tr;
        if (!pos) {
          return;
        }
        tr = tr.setMeta(imagePlaceholderPluginKey, {
          type: 'remove',
          id,
        } as ImagePlaceholderRemoveAction);
        const node = props.editorView.state.schema.nodes['image'].create({
          src: file.url,
        });
        tr = tr.replaceWith(pos, pos, node);
        props.editorView.dispatch(tr);
      }),
    );
  };

  return (
    <div
      className={classes(
        'pmp-view-menubar-wrapper',
        props.isScrolltop ? 'scroll-top' : '',
      )}
    >
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
      <PmpButton
        ref={textColorButtonRef}
        onClick={() => {
          const rect = textColorButtonRef.current!.getBoundingClientRect();
          setTextColorLayerRef({
            top: rect.top + rect.height + 10,
            left: rect.left,
          });
        }}
      >
        <i className="ri-font-color" />
      </PmpButton>
      {textColorLayerRef && (
        <PmpLayer
          top={textColorLayerRef.top}
          left={textColorLayerRef.left}
          closeOnEsc={true}
          outerMousedown={() => setTextColorLayerRef(null)}
          onClose={() => setTextColorLayerRef(null)}
        >
          <PmpColorPicker
            onChange={(color: string) => {
              setTextColorLayerRef(null);
              props.onTextColorClick(color);
            }}
          />
        </PmpLayer>
      )}
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
      <PmpButton
        ref={linkButtonRef}
        disabled={!props.canLink}
        onClick={() => {
          const { from, to } = props.editorView.state.selection;
          const start = props.editorView.coordsAtPos(from);
          const end = props.editorView.coordsAtPos(to);
          setLinkLayerRef({
            top: end.bottom + 10,
            left: start.left,
            from,
            to,
            link: '',
            text: props.editorView.state.doc.textBetween(from, to),
          });
        }}
      >
        <i className="ri-links-line" />
      </PmpButton>
      {linkLayerRef && (
        <PmpLayer
          top={linkLayerRef.top}
          left={linkLayerRef.left}
          closeOnEsc={true}
          outerMousedown={() => setLinkLayerRef(null)}
          onClose={() => setLinkLayerRef(null)}
        >
          <PmpLinkFormLayer
            text={linkLayerRef.text}
            link={linkLayerRef.link}
            onSubmit={(link: string, text: string) => {
              setLinkLayerRef(null);
              props.setLink(linkLayerRef.from, linkLayerRef.to, text, link);
              // props.setLink();
            }}
            onCancel={() => setLinkLayerRef(null)}
          />
        </PmpLayer>
      )}
      <PmpInput
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void onImageChange(e);
        }}
      />
      <PmpButton
        onClick={() => {
          imageInputRef.current!.click();
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
        ref={commandButtonRef}
        onClick={() => {
          const rect = commandButtonRef.current!.getBoundingClientRect();
          setCommandLayerRef({
            top: rect.top + rect.height + 10,
            left: rect.left,
            selectedIndex: 0,
          });
        }}
      >
        <i className="ri-slash-commands" />
      </PmpButton>
      {commandLayerRef && (
        <PmpLayer
          top={commandLayerRef.top}
          left={commandLayerRef.left}
          closeOnEsc={true}
          outerMousedown={() => setCommandLayerRef(null)}
          onClose={() => setCommandLayerRef(null)}
        >
          <PmpCommand
            items={PMP_DEFAULT_COMMAND_LIST}
            selectedIndex={commandLayerRef.selectedIndex}
            onHover={(index) => {
              setCommandLayerRef({
                ...commandLayerRef,
                selectedIndex: index,
              });
            }}
            onClick={(index: number) => {
              PMP_DEFAULT_COMMAND_LIST[index].action(props.editorView, true);
              props.editorView.focus();
              setCommandLayerRef(null);
            }}
          />
        </PmpLayer>
      )}
    </div>
  );
};

export class PmpMenubarView implements PluginView {
  public readonly editorRoot = (() => {
    const div = document.createElement('div');
    div.classList.add('pmp-view-editor-root');
    return div;
  })();

  public readonly editorWrapper = (() => {
    const div = document.createElement('div');
    div.classList.add('pmp-view-editor-scroll');
    return div;
  })();

  public readonly menubarWrapper = (() => {
    const div = document.createElement('div');
    div.classList.add('pmp-view-editor-menubar-root');
    return div;
  })();

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

  public textColorLayerRef: HTMLElement | null = null;

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
    editorView.dom.classList.add('pmp-view-editor');
    const originParent = editorView.dom.parentElement!;
    const originIndex = Array.from(originParent.children).indexOf(
      editorView.dom,
    );
    this.editorRoot.appendChild(this.menubarWrapper);
    this.editorRoot.appendChild(this.editorWrapper);
    this.editorWrapper.appendChild(editorView.dom);
    originParent.insertBefore(
      this.editorRoot,
      originParent.children[originIndex],
    );
    this.isScrollTop = this.editorWrapper.scrollTop === 0;
    this.editorWrapper.addEventListener('scroll', () => {
      this.isScrollTop = this.editorWrapper.scrollTop === 0;
      this.render();
    });
    this.render();
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
        editorView={this.editorView}
        editorState={this.editorView.state}
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
        onTextColorClick={(color) => this.onTextColorClick(color)}
        onAlignClick={(alignment) => this.onAlignClick(alignment)}
        onOrderedListClick={() => this.onOrderedListClick()}
        onUnorderedListClick={() => this.onUnorderedListClick()}
        onIncreaseIndentClick={() => this.onIncreaseIndentClick()}
        onDecreaseIndentClick={() => this.onDecreaseIndentClick()}
        setLink={(from, to, text, link) => this.setLink(from, to, text, link)}
        onMentionClick={() => this.onMentionClick()}
        onBlockQuoteClick={() => this.onBlockQuoteClick()}
        onTableClick={() => this.onTableClick()}
      />,
      this.menubarWrapper,
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

  public setLink(from: number, to: number, text: string, link: string): void {
    let tr = this.editorView.state.tr;
    tr = addLink(tr, from, to, text, link);
    this.editorView.dispatch(tr);
    this.editorView.focus();
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

  public onTextColorClick(color: string): void {
    const { from, to } = this.editorView.state.tr.selection;
    if (from === to) {
      toggleMark(this.editorView.state.schema.marks['textColor'], {
        color,
      })(this.editorView.state, this.editorView.dispatch);
      this.editorView.focus();
      return;
    }
    let tr = this.editorView.state.tr;
    tr = tr.addMark(
      from,
      to,
      this.editorView.state.schema.marks['textColor'].create({
        color,
      }),
    );
    this.editorView.dispatch(tr);
    this.editorView.focus();
  }

  public destroy() {
    render(null, this.menubarWrapper);
  }
}

export const PmpMenubarPlugin = new Plugin({
  key: new PluginKey('pmp-menubar'),
  view: (editorView) => new PmpMenubarView(editorView),
});
