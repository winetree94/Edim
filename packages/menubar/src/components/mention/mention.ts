import { EdimButton, html } from '@edim-editor/ui';
import { addMention } from '@edim-editor/mention';
import { useContext } from 'preact/hooks';
import { EdimMenubarContext } from '../context';

export const EdimMenubarMentionButtons = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.mention) {
    return null;
  }

  return html`
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => {
        addMention()(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      }}>
      <i class="ri-at-line"></i>
    </${EdimButton}>
  `;
};
