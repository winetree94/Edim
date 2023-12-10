import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { PmpButton, html } from 'prosemirror-preset-ui';
import { toggleList } from 'prosemirror-preset-flat-list';
import { findParentNode } from 'prosemirror-utils';

export const PmpMenubarTaskListToggleButtons = () => {
  const context = useContext(PmpMenubarContext);

  const canTaskList = toggleList({
    listType: context.editorView.state.schema.nodes['task_list'],
    listItemType: context.editorView.state.schema.nodes['task_list_item'],
  })(context.editorView.state);
  const activeOrderedList = !!findParentNode(
    (node) => node.type === context.editorView.state.schema.nodes['task_list'],
  )(context.editorView.state.selection);

  const onTaskListClick = (): void => {
    toggleList({
      listType: context.editorView.state.schema.nodes['task_list'],
      listItemType: context.editorView.state.schema.nodes['task_list_item'],
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  return html`
    <${PmpButton}
      className="pmp-icon-button ${activeOrderedList ? 'selected' : ''}"
      disabled=${!canTaskList}
      onClick=${() => onTaskListClick()}>
      <i class="ri-checkbox-line"></i>
    </${PmpButton}>
  `;
};
