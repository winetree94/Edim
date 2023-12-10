import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { PmpButton, html } from 'prosemirror-preset-ui';
import { indentListItem } from 'prosemirror-preset-flat-list';

export const PmpMenubarIndentButtons = () => {
  const context = useContext(PmpMenubarContext);

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
  <${PmpButton}
  className="pmp-icon-button"
  onClick=${() => onDecreaseIndentClick()}
  >
  <i className="ri-indent-decrease" />
</${PmpButton}>
<${PmpButton}
  className="pmp-icon-button"
  onClick=${() => onIncreaseIndentClick()}
  >
  <i className="ri-indent-increase" />
</${PmpButton}>
  `;
};
