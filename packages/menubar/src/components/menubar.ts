import { forwardRef } from 'preact/compat';
import { EdimSeparator, classes, html } from '@edim-editor/ui';
import { EdimMenubarContext, EdimMenubarContextType } from './context';
import { EdimMenubarTextTypeSelect } from './text-type';
import { EdimMenubarFontFamilySelect } from './font-family';
import { EdimMenubarMarkToggleButtons } from './marks';
import { EdimMenubarFontColorSelect } from './font-color';
import { EdimMenubarTextAlignSelect } from './text-align';
import { EdimMenubarListToggleButtons } from './list';
import { EdimMenubarTaskListToggleButtons } from './task-list';
import { EdimMenubarBlockquoteToggleButtons } from './blockquote';
import { EdimMenubarCodeblockToggleButtons } from './codeblock';
import { EdimMenubarTableButtons } from './table';
import { EdimMenubarLinkButton } from './link';
import { EdimMenubarMentionButtons } from './mention';

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
            ? html`
                <${EdimSeparator} className="edim-view-menubar-separator" />
              `
            : null
        }
        <${EdimMenubarMarkToggleButtons} />
        <${EdimMenubarFontColorSelect} />
        <${EdimMenubarTextAlignSelect} />
        <${EdimMenubarListToggleButtons} />

        <${EdimMenubarTaskListToggleButtons} />
        <${EdimMenubarBlockquoteToggleButtons} />
        <${EdimMenubarCodeblockToggleButtons} />
        <${EdimMenubarTableButtons} />
        <${EdimMenubarLinkButton} />
        <${EdimMenubarMentionButtons} />
      </div>
    </${EdimMenubarContext.Provider}>
  `;
});
