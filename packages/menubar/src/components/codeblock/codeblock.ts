import { EdimButton, html } from '@edim-editor/ui';
import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { setBlockType } from 'prosemirror-commands';

export const EdimMenubarCodeblockToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.codeblock) {
    return null;
  }

  const codeblockNodeType = context.options.codeblock.codeBlockNodeType;

  return html`
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => {
        setBlockType(codeblockNodeType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
      }}>
      <i class="ri-code-s-slash-line"></i>
    </${EdimButton}>
  `;
};
