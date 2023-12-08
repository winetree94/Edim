import { forwardRef } from 'preact/compat';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useRef, useState } from 'preact/hooks';
import {
  PmpLayer,
  PmpSeparator,
  PmpButton,
  classes,
  html,
} from 'prosemirror-preset-ui';
import { PmpEmojiPicker } from 'prosemirror-preset-ui';
import { PmpMenubarContext } from './context';
import { PmpMenubarTextTypeSelect } from './text-type';
import { PmpMenubarFontFamilySelect } from './font-family';
import { PmpMenubarMarkToggleButtons } from './marks';
import { PmpMenubarFontColorSelect } from './font-color';
import { PmpMenubarTextAlignSelect } from './text-align';
import { PmpMenubarListToggleButtons } from './list';
import { PmpMenubarIndentButtons } from './indent';
import { PmpMenubarAddMoreSelect } from './add-more';
import { setBlockType } from 'prosemirror-commands';
import { insertTable } from 'prosemirror-preset-tables';

export interface PmpMenubarProps {
  editorView: EditorView;
  editorState: EditorState;
}

export const PmpMenubar = forwardRef((props: PmpMenubarProps) => {
  const [emojiLayerRef, setEmojiLayerRef] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  return html`
    <${PmpMenubarContext.Provider} value="${{
      editorView: props.editorView,
      editorState: props.editorState,
    }}">
    <div className=${classes('pmp-view-menubar-wrapper')}>
      ${
        props.editorView.state.schema.nodes['heading'] &&
        html` <${PmpMenubarTextTypeSelect} /> `
      }
      ${
        props.editorView.state.schema.marks['font_family'] &&
        html` <${PmpMenubarFontFamilySelect} /> `
      }
      ${
        props.editorView.state.schema.nodes['heading'] ||
        props.editorView.state.schema.marks['font_family']
          ? html` <${PmpSeparator} className="pmp-view-menubar-separator" /> `
          : null
      }
      <${PmpMenubarMarkToggleButtons} />

      ${
        props.editorView.state.schema.marks['text_color'] &&
        html`
          <${PmpMenubarFontColorSelect} />
          <${PmpSeparator} className="pmp-view-menubar-separator" />
        `
      }

      <${PmpMenubarTextAlignSelect} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />
      <${PmpMenubarListToggleButtons} />
      <${PmpMenubarIndentButtons} />
      <${PmpSeparator} className="pmp-view-menubar-separator" />

      <${PmpButton}
        className="pmp-icon-button"
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['blockquote'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
        }}>
        <i class="ri-double-quotes-r"></i>
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['code_block'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
        }}>
        <i class="ri-code-s-slash-line"></i>
      </${PmpButton}>
      <${PmpButton}
        className="pmp-icon-button"
        onClick=${() => {
          insertTable()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}>
        <i class="ri-table-2"></i>
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

      <${PmpMenubarAddMoreSelect} />
    </div>
    </${PmpMenubarContext.Provider}>
  `;
});
