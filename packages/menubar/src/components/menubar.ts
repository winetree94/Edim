import { forwardRef } from 'preact/compat';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useRef, useState } from 'preact/hooks';
import {
  EdimLayer,
  EdimSeparator,
  EdimButton,
  classes,
  html,
} from '@edim-editor/ui';
import { EdimEmojiPicker } from '@edim-editor/ui';
import { EdimMenubarContext } from './context';
import { EdimMenubarTextTypeSelect } from './text-type';
import { EdimMenubarFontFamilySelect } from './font-family';
import { EdimMenubarMarkToggleButtons } from './marks';
import { EdimMenubarFontColorSelect } from './font-color';
import { EdimMenubarTextAlignSelect } from './text-align';
import { EdimMenubarListToggleButtons } from './list';
import { EdimMenubarIndentButtons } from './indent';
import { EdimMenubarAddMoreSelect } from './add-more';
import { setBlockType } from 'prosemirror-commands';
import { insertTable } from '@edim-editor/tables';
import { EdimMenubarTaskListToggleButtons } from './task-list';

export interface EdimMenubarProps {
  editorView: EditorView;
  editorState: EditorState;
}

export const EdimMenubar = forwardRef((props: EdimMenubarProps) => {
  const [emojiLayerRef, setEmojiLayerRef] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  return html`
    <${EdimMenubarContext.Provider} value="${{
      editorView: props.editorView,
      editorState: props.editorState,
    }}">
    <div className=${classes('edim-view-menubar-wrapper')}>
      ${
        props.editorView.state.schema.nodes['heading'] &&
        html` <${EdimMenubarTextTypeSelect} /> `
      }
      ${
        props.editorView.state.schema.marks['font_family'] &&
        html` <${EdimMenubarFontFamilySelect} /> `
      }
      ${
        props.editorView.state.schema.nodes['heading'] ||
        props.editorView.state.schema.marks['font_family']
          ? html` <${EdimSeparator} className="edim-view-menubar-separator" /> `
          : null
      }
      <${EdimMenubarMarkToggleButtons} />

      ${
        props.editorView.state.schema.marks['text_color'] &&
        html`
          <${EdimMenubarFontColorSelect} />
          <${EdimSeparator} className="edim-view-menubar-separator" />
        `
      }

      <${EdimMenubarTextAlignSelect} />
      <${EdimSeparator} className="edim-view-menubar-separator" />
      <${EdimMenubarListToggleButtons} />
      <${EdimMenubarIndentButtons} />
      <${EdimSeparator} className="edim-view-menubar-separator" />

      <${EdimMenubarTaskListToggleButtons} />
      <${EdimButton}
        className="edim-icon-button"
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['blockquote'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
        }}>
        <i class="ri-double-quotes-r"></i>
      </${EdimButton}>
      <${EdimButton}
        className="edim-icon-button"
        onClick=${() => {
          setBlockType(props.editorView.state.schema.nodes['code_block'])(
            props.editorView.state,
            props.editorView.dispatch,
          );
        }}>
        <i class="ri-code-s-slash-line"></i>
      </${EdimButton}>
      <${EdimButton}
        className="edim-icon-button"
        onClick=${() => {
          insertTable()(props.editorView.state, props.editorView.dispatch);
          props.editorView.focus();
        }}>
        <i class="ri-table-2"></i>
      </${EdimButton}>

      ${
        props.editorState.schema.nodes['emoji'] &&
        html`
        <${EdimButton}
          className="edim-icon-button"
          ref=${emojiButtonRef} onClick=${() => {
            const rect = emojiButtonRef.current!.getBoundingClientRect();
            setEmojiLayerRef({
              top: rect.top + rect.height + 10,
              left: rect.left,
            });
          }}>
          <i className="ri-emoji-sticker-line" />
        </${EdimButton}>
      `
      }
      ${
        emojiLayerRef &&
        html`
        <${EdimLayer}
          top=${emojiLayerRef.top}
          left=${emojiLayerRef.left}
          closeOnEsc=${true}
          outerMousedown=${() => setEmojiLayerRef(null)}
          onClose=${() => setEmojiLayerRef(null)}
          >
          <${EdimEmojiPicker} size=${32} gap=${1}>emoji</${EdimEmojiPicker}>
        </${EdimLayer}>
      `
      }

      <${EdimMenubarAddMoreSelect} />
    </div>
    </${EdimMenubarContext.Provider}>
  `;
});
