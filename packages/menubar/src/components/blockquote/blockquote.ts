import { EdimButton, html } from '@edim-editor/ui';
import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { setBlockType } from 'prosemirror-commands';

export const EdimMenubarBlockquoteToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.blockquote) {
    return null;
  }

  const blockquoteNodeType = context.options.blockquote.blockQuoteNodeType;

  return html`
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => {
        setBlockType(blockquoteNodeType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
      }}>
      <i class="ri-double-quotes-r"></i>
    </${EdimButton}>
  `;
};
