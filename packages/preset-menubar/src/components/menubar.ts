/* eslint-disable @typescript-eslint/unbound-method */
import { EditorState } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { addMention } from 'prosemirror-preset-mention';
import { toggleBlockquote } from 'prosemirror-preset-blockquote';
import { addLink, PmpLinkFormLayer } from 'prosemirror-preset-link';
import { insertTable } from 'prosemirror-preset-tables';
import { PmpLayer } from 'prosemirror-preset-ui';
import { PmpSeparator } from 'prosemirror-preset-ui';
import { PmpButton } from 'prosemirror-preset-ui';
import { useRef, useState } from 'preact/hooks';
import {
  PMP_DEFAULT_COMMAND_LIST,
  PmpCommand,
} from 'prosemirror-preset-command';
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
import { PmpMenubarContext } from './context';
import { PmpMenubarTextTypeSelect } from './text-type';
import { PmpMenubarFontFamilySelect } from './font-family';
import { PmpMenubarMarkToggleButtons } from './marks';
import { PmpMenubarFontColorSelect } from './font-color';
import { PmpMenubarTextAlignSelect } from './text-align';
import { PmpMenubarListToggleButtons } from './list';
import { PmpMenubarIndentButtons } from './indent';

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

export interface PmpMenubarProps {
  editorView: EditorView;
  editorState: EditorState;
}

export const PmpMenubar = forwardRef((props: PmpMenubarProps) => {
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

  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const commandButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

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
    <${PmpMenubarContext.Provider} value="${{
      editorView: props.editorView,
      editorState: props.editorState,
    }}">
    <div className=${classes('pmp-view-menubar-wrapper')}>
      <${PmpMenubarTextTypeSelect} />
      <${PmpMenubarFontFamilySelect} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      <${PmpMenubarMarkToggleButtons} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      <${PmpMenubarFontColorSelect} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      <${PmpMenubarTextAlignSelect} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      <${PmpMenubarListToggleButtons} />
      <${PmpMenubarIndentButtons} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton} className="pmp-icon-button" disabled=${true}>
        <i className="ri-checkbox-line" />
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
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
        className="pmp-icon-button"
        onClick=${() => {
          imageInputRef.current!.click();
        }}
        >
        <i className="ri-image-line" />
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
        onClick=${() => {
          addMention()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-at-line" />
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
        onClick=${() => {
          toggleBlockquote()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-double-quotes-l" />
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
        ref=${emojiButtonRef} onClick=${() => {
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
        className="pmp-icon-button"
        onClick=${() => {
          insertTable()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}
        >
        <i className="ri-table-2" />
      </${PmpButton}>
      <${PmpButton} className="pmp-icon-button" disabled=${true}>
        <i className="ri-code-s-slash-fill" />
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
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
    </${PmpMenubarContext.Provider}>
  `;
});
