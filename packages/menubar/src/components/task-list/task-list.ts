import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, html } from '@edim-editor/ui';
import { toggleList } from '@edim-editor/flat-list';
import { findParentNode } from 'prosemirror-utils';
import {
  checkTaskListItemNodeType,
  checkTaskListNodeType,
} from '@edim-editor/flat-task-list';

export const EdimMenubarTaskListToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  const useTaskList = checkTaskListNodeType(undefined)(
    context.editorView.state,
  );
  const useTaskListItem = checkTaskListItemNodeType(undefined)(
    context.editorView.state,
  );

  if (!useTaskList || !useTaskListItem) {
    return null;
  }

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
    <${EdimButton}
      className="edim-icon-button ${activeOrderedList ? 'selected' : ''}"
      disabled=${!canTaskList}
      onClick=${() => onTaskListClick()}>
      <i class="ri-checkbox-line"></i>
    </${EdimButton}>
  `;
};
