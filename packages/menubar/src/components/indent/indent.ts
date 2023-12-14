import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, html } from '@edim-editor/ui';
import { indentListItem } from '@edim-editor/flat-list';

export const EdimMenubarIndentButtons = () => {
  const context = useContext(EdimMenubarContext);

  const onIncreaseIndentClick = (): void => {
    indentListItem({
      listNodeTypes: [
        context.editorState.schema.nodes['bullet_list'],
        context.editorState.schema.nodes['ordered_list'],
      ],
      listItemNodeType: context.editorState.schema.nodes['list_item'],
      reduce: 1,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  const onDecreaseIndentClick = (): void => {
    indentListItem({
      listNodeTypes: [
        context.editorState.schema.nodes['bullet_list'],
        context.editorState.schema.nodes['ordered_list'],
      ],
      listItemNodeType: context.editorState.schema.nodes['list_item'],
      reduce: -1,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  return html`
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => onDecreaseIndentClick()}
      >
      <i className="ri-indent-decrease" />
    </${EdimButton}>
    <${EdimButton}
      className="edim-icon-button"
      onClick=${() => onIncreaseIndentClick()}
      >
      <i className="ri-indent-increase" />
    </${EdimButton}>
  `;
};
