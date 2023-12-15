import { EdimButton, html } from '@edim-editor/ui';
import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { insertTable } from '@edim-editor/tables';

export const EdimMenubarTableButtons = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.table) {
    return null;
  }

  return html`
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => {
        insertTable()(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      }}>
      <i class="ri-table-2"></i>
    </${EdimButton}>
  `;
};
