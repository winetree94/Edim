import { forwardRef } from 'preact/compat';
import { setBlockType } from 'prosemirror-commands';
import { EdimSeparator, EdimButton, classes, html } from '@edim-editor/ui';
import { insertTable } from '@edim-editor/tables';
import { EdimMenubarContext, EdimMenubarContextType } from './context';
import { EdimMenubarTextTypeSelect } from './text-type';
import { EdimMenubarFontFamilySelect } from './font-family';
import { EdimMenubarMarkToggleButtons } from './marks';
import { EdimMenubarFontColorSelect } from './font-color';
import { EdimMenubarTextAlignSelect } from './text-align';
import { EdimMenubarListToggleButtons } from './list';
import { EdimMenubarAddMoreSelect } from './add-more';
import { EdimMenubarTaskListToggleButtons } from './task-list';

export const EdimMenubar = forwardRef((props: EdimMenubarContextType) => {
  const useTextType = !!props.options.textType;
  const useFontFamily = !!props.options.fontFamily;

  return html`
    <${EdimMenubarContext.Provider} value="${{
      editorView: props.editorView,
      editorState: props.editorState,
      options: props.options,
    }}">
    <div className=${classes('edim-view-menubar-wrapper')}>
      <${EdimMenubarTextTypeSelect} />
      <${EdimMenubarFontFamilySelect} />
      ${
        useTextType || useFontFamily
          ? html` <${EdimSeparator} className="edim-view-menubar-separator" /> `
          : null
      }
      <${EdimMenubarMarkToggleButtons} />
      <${EdimMenubarFontColorSelect} />
      <${EdimMenubarTextAlignSelect} />
      <${EdimMenubarListToggleButtons} />

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
      <${EdimMenubarAddMoreSelect} />
    </div>
    </${EdimMenubarContext.Provider}>
  `;
});
