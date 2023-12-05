/* eslint-disable @typescript-eslint/unbound-method */
import { render } from 'preact';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { setBlockType, toggleMark } from 'prosemirror-commands';
import { indentListItem, toggleList } from 'prosemirror-preset-flat-list';
import { addMention } from 'prosemirror-preset-mention';
import { toggleBlockquote } from 'prosemirror-preset-blockquote';
import { markActive } from 'prosemirror-preset-core';
import {
  getRangeFirstAlignment,
  getRangeIsText,
  setAlignment,
  setToParagraph,
} from 'prosemirror-preset-paragraph';
import { addLink, PmpLinkFormLayer } from 'prosemirror-preset-link';
import { redo, undo } from 'prosemirror-history';
import { insertTable } from 'prosemirror-preset-tables';
import { PmpLayer } from 'prosemirror-preset-ui';
import { PmpSeparator } from 'prosemirror-preset-ui';
import { PmpButton } from 'prosemirror-preset-ui';
import { useRef, useState } from 'preact/hooks';
import { PmpColorPicker } from 'prosemirror-preset-ui';
import { PMP_DEFAULT_COMMAND_LIST, PmpCommand } from 'prosemirror-preset-command';
import { PmpInput } from 'prosemirror-preset-ui';
import { TargetedEvent, forwardRef } from 'preact/compat';
import {
  ImagePlaceholderAddAction,
  ImagePlaceholderRemoveAction,
  ImagePlaceholderUpdateAction,
  findPlaceholderPos,
  imageFileToBase64Url,
  imagePlaceholderPluginKey,
  parseImageMeta,
} from 'prosemirror-preset-image';
import { classes } from 'prosemirror-preset-ui';
import { html } from 'prosemirror-preset-ui';
import { PmpEmojiPicker } from 'prosemirror-preset-ui';

export interface PmpMenubarProps {
  editorView: EditorView;
  editorState: EditorState;
  isScrolltop: boolean;
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
    }, 300);
  });
};

export const PmpMenubar = forwardRef((props: PmpMenubarProps) => {
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

  const [emojiLayerRef, setEmojiLayerRef] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const textColorButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const commandButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const canUndo = undo(props.editorView.state);
  const canRedo = redo(props.editorView.state);

  const canNormalText = getRangeIsText(props.editorView.state);
  const rangeFromNode = props.editorView.state.selection.$from.parent;

  // text node
  const activeParagraph =
    canNormalText && rangeFromNode.type.name === 'paragraph';
  const activeH1 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 1;
  const activeH2 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 2;
  const activeH3 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 3;
  const activeH4 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 4;
  const activeH5 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 5;
  const activeH6 =
    canNormalText &&
    rangeFromNode.type.name === 'heading' &&
    rangeFromNode.attrs['level'] === 6;

  // marks
  const activeBold = markActive(
    props.editorView.state,
    props.editorView.state.schema.marks['strong'],
  );
  const activeItalic = markActive(
    props.editorView.state,
    props.editorView.state.schema.marks['em'],
  );
  const activeStrikethrough = markActive(
    props.editorView.state,
    props.editorView.state.schema.marks['strikethrough'],
  );
  const activeInlineCode = markActive(
    props.editorView.state,
    props.editorView.state.schema.marks['code'],
  );

  const firstAlignment = getRangeFirstAlignment(props.editorView.state);
  const activeAlignLeft = firstAlignment === 'left';
  const activeAlignCenter = firstAlignment === 'center';
  const activeAlignRight = firstAlignment === 'right';

  const onIncreaseIndentClick = (): void => {
    indentListItem(1)(props.editorView.state, props.editorView.dispatch);
    props.editorView.focus();
  };

  const onDecreaseIndentClick = (): void => {
    indentListItem(-1)(props.editorView.state, props.editorView.dispatch);
    props.editorView.focus();
  };

  const canOrderedList = toggleList(
    props.editorView.state.schema.nodes['ordered_list'],
  )(props.editorView.state);
  const canBulletList = toggleList(
    props.editorView.state.schema.nodes['bullet_list'],
  )(props.editorView.state);
  const activeOrderedList = !!findParentNode(
    (node) => node.type === props.editorView.state.schema.nodes['ordered_list'],
  )(props.editorView.state.selection);
  const activeUnorderedList = !!findParentNode(
    (node) => node.type === props.editorView.state.schema.nodes['bullet_list'],
  )(props.editorView.state.selection);

  const onOrderedListClick = (): void => {
    toggleList(props.editorView.state.schema.nodes['ordered_list'])(
      props.editorView.state,
      props.editorView.dispatch,
    );
    props.editorView.focus();
  };

  const onUnorderedListClick = (): void => {
    toggleList(props.editorView.state.schema.nodes['bullet_list'])(
      props.editorView.state,
      props.editorView.dispatch,
    );
    props.editorView.focus();
  };

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

        const adjacentInsertableParent = findParentNode((node) => {
          return node?.type.spec.group?.includes('block-container') || false;
        })(props.editorView.state.selection);

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

  return html`
    <div
      className=${classes(
        'pmp-view-menubar-wrapper',
        props.isScrolltop ? 'scroll-top' : '',
      )}
      >
      <${PmpButton}
        disabled=${!canUndo}
        onClick=${() => {
          undo(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-arrow-go-back-line" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canRedo}
        onClick=${() => {
          redo(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-arrow-go-forward-line" />
      </${PmpButton}>
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      
      <${PmpButton}
        className=${activeParagraph ? 'selected' : ''}
        onClick=${() => {
          setToParagraph(props.editorView.state.schema.nodes['paragraph'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-text" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH1 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 1,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-1" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH2 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 2,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-2" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH3 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 3,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-3" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH4 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 4,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-4" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH5 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 5,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-5" />
      </${PmpButton}>
      <${PmpButton}
        disabled=${!canNormalText}
        className=${activeH6 ? 'selected' : ''}
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['heading'], {
            level: 6,
          })(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-h-6" />
      </${PmpButton}>
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton}
        className=${activeBold ? 'selected' : ''}
        onClick=${() => {
          toggleMark(props.editorView.state.schema.marks['strong'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-bold" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeItalic ? 'selected' : ''}
        onClick=${() => {
          toggleMark(props.editorView.state.schema.marks['em'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-italic" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeStrikethrough ? 'selected' : ''}
        onClick=${() => {
          toggleMark(props.editorView.state.schema.marks['strikethrough'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-strikethrough-2" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeInlineCode ? 'selected' : ''}
        onClick=${() => {
          toggleMark(props.editorView.state.schema.marks['code'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-code-line" />
      </${PmpButton}>
      <${PmpButton}
        ref=${textColorButtonRef}
        onClick=${() => {
          const rect = textColorButtonRef.current!.getBoundingClientRect();
          setTextColorLayerRef({
            top: rect.top + rect.height + 10,
            left: rect.left,
          });
        }}
        >
        <i className="ri-font-color" />
      </${PmpButton}>
      ${
        textColorLayerRef &&
        html`
        <${PmpLayer}
          top=${textColorLayerRef.top}
          left=${textColorLayerRef.left}
          closeOnEsc=${true}
          outerMousedown=${() => setTextColorLayerRef(null)}
          onClose=${() => setTextColorLayerRef(null)}
          >
          <${PmpColorPicker}
            onChange=${(color: string) => {
              setTextColorLayerRef(null);
              const { from, to } = props.editorView.state.tr.selection;
              if (from === to) {
                toggleMark(props.editorView.state.schema.marks['textColor'], {
                  color,
                })(props.editorView.state, props.editorView.dispatch);
                props.editorView.focus();
                return;
              }
              let tr = props.editorView.state.tr;
              tr = tr.addMark(
                from,
                to,
                props.editorView.state.schema.marks['textColor'].create({
                  color,
                }),
              );
              props.editorView.dispatch(tr);
              props.editorView.focus();
            }}
            />
        </${PmpLayer}>
      `
      }
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton}
        className=${activeAlignLeft ? 'selected' : ''}
        onClick=${() => {
          setAlignment('left')(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-align-left" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeAlignCenter ? 'selected' : ''}
        onClick=${() => {
          setAlignment('center')(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-align-center" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeAlignRight ? 'selected' : ''}
        onClick=${() => {
          setAlignment('right')(
            props.editorView.state,
            props.editorView.dispatch,
          );
          props.editorView.focus();
        }}
        >
        <i className="ri-align-right" />
      </${PmpButton}>
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton}
        className=${activeOrderedList ? 'selected' : ''}
        disabled=${!canOrderedList}
        onClick=${() => onOrderedListClick()}
        >
        <i className="ri-list-ordered" />
      </${PmpButton}>
      <${PmpButton}
        className=${activeUnorderedList ? 'selected' : ''}
        disabled=${!canBulletList}
        onClick=${() => onUnorderedListClick()}
        >
        <i className="ri-list-unordered" />
      </${PmpButton}>
      <${PmpButton}
        onClick=${() => onDecreaseIndentClick()}
        >
        <i className="ri-indent-decrease" />
      </${PmpButton}>
      <${PmpButton}
        onClick=${() => onIncreaseIndentClick()}
        >
        <i className="ri-indent-increase" />
      </${PmpButton}>
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton} disabled=${true}>
        <i className="ri-checkbox-line" />
      </${PmpButton}>
      <${PmpButton}
        ref=${linkButtonRef}
        onClick=${() => {
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
      </${PmpButton}>
      ${
        linkLayerRef &&
        html`
        <${PmpLayer}
          top=${linkLayerRef.top}
          left=${linkLayerRef.left}
          closeOnEsc=${true}
          outerMousedown=${() => setLinkLayerRef(null)}
          onClose=${() => setLinkLayerRef(null)}
          >
          <${PmpLinkFormLayer}
            text=${linkLayerRef.text}
            link=${linkLayerRef.link}
            onSubmit=${(link: string, text: string) => {
              setLinkLayerRef(null);
              const { from, to } = props.editorView.state.selection;
              let tr = props.editorView.state.tr;
              tr = addLink(tr, from, to, text, link);
              props.editorView.dispatch(tr);
              props.editorView.focus();
            }}
            onCancel=${() => setLinkLayerRef(null)}
            />
        </${PmpLayer}>
      `
      }
      <${PmpInput}
        ref=${imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange=${(e: TargetedEvent<HTMLInputElement, Event>) => {
          void onImageChange(e);
        }}
        />
      <${PmpButton}
        onClick=${() => {
          imageInputRef.current!.click();
        }}
        >
        <i className="ri-image-line" />
      </${PmpButton}>
      <${PmpButton}
        onClick=${() => {
          addMention()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-at-line" />
      </${PmpButton}>
      <${PmpButton}
        onClick=${() => {
          toggleBlockquote()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-double-quotes-l" />
      </${PmpButton}>
      <${PmpButton} ref=${emojiButtonRef} onClick=${() => {
        const rect = emojiButtonRef.current!.getBoundingClientRect();
        setEmojiLayerRef({
          top: rect.top + rect.height + 10,
          left: rect.left,
        });
      }}>
        <i className="ri-emoji-sticker-line" />
      </${PmpButton}>
      ${
        emojiLayerRef &&
        html`
        <${PmpLayer}
          top=${emojiLayerRef.top}
          left=${emojiLayerRef.left}
          closeOnEsc=${true}
          outerMousedown=${() => setEmojiLayerRef(null)}
          onClose=${() => setEmojiLayerRef(null)}
          >
          <${PmpEmojiPicker} size=${32} gap=${1}>emoji</${PmpEmojiPicker}>
        </${PmpLayer}>
      `
      }
      <${PmpButton}
        onClick=${() => {
          insertTable()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-table-2" />
      </${PmpButton}>
      <${PmpButton} disabled=${true}>
        <i className="ri-code-s-slash-fill" />
      </${PmpButton}>
      <${PmpButton}
        ref=${commandButtonRef}
        onClick=${() => {
          const rect = commandButtonRef.current!.getBoundingClientRect();
          setCommandLayerRef({
            top: rect.top + rect.height + 10,
            left: rect.left,
            selectedIndex: 0,
          });
        }}
        >
        <i className="ri-slash-commands" />
      </${PmpButton}>
      ${
        commandLayerRef &&
        html`
        <${PmpLayer}
          top=${commandLayerRef.top}
          left=${commandLayerRef.left}
          closeOnEsc=${true}
          outerMousedown=${() => setCommandLayerRef(null)}
          onClose=${() => setCommandLayerRef(null)}
          >
          <${PmpCommand}
            items=${PMP_DEFAULT_COMMAND_LIST}
            selectedIndex=${commandLayerRef.selectedIndex}
            onHover=${(index: number) => {
              setCommandLayerRef({
                ...commandLayerRef,
                selectedIndex: index,
              });
            }}
            onClick=${(index: number) => {
              PMP_DEFAULT_COMMAND_LIST[index].action(props.editorView, true);
              props.editorView.focus();
              setCommandLayerRef(null);
            }}
            />
        </${PmpLayer}>
      `
      }
    </div>
  `;
});

export class PmpMenubarView implements PluginView {
  public readonly editorRoot: HTMLDivElement;
  public readonly editorWrapper: HTMLDivElement;
  public readonly menubarWrapper: HTMLDivElement;
  public readonly editorView: EditorView;

  public isScrollTop = false;

  public constructor(editorView: EditorView) {
    this.editorView = editorView;

    const editorRoot = document.createElement('div');
    editorRoot.classList.add('pmp-view-editor-root');
    this.editorRoot = editorRoot;

    const editorWrapper = document.createElement('div');
    editorWrapper.classList.add('pmp-view-editor-scroll');
    this.editorWrapper = editorWrapper;

    const menubarWrapper = document.createElement('div');
    menubarWrapper.classList.add('pmp-view-editor-menubar-root');
    this.menubarWrapper = menubarWrapper;

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
    this.render();
  }

  public render() {
    render(
      html`
        <${PmpMenubar}
          editorView=${this.editorView}
          editorState=${this.editorView.state}
          isScrolltop=${this.isScrollTop}
        />
      `,
      this.menubarWrapper,
    );
  }

  public destroy() {
    render(null, this.menubarWrapper);
  }
}

export const PmpMenubarPlugin = new Plugin({
  key: new PluginKey('pmp-menubar'),
  view: (editorView) => {
    return new PmpMenubarView(editorView);
  },
});
