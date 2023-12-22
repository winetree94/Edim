import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, html } from '@edim-editor/ui';
import { toggleList } from '@edim-editor/flat-list';
import { findParentNode } from 'prosemirror-utils';

export const EdimMenubarTaskListToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.taskList) {
    return null;
  }

  const taskListNodeType = context.options.taskList.taskListNodeType;
  const taskListItemNodeType = context.options.taskList.taskListItemNodeType;

  const canTaskList = toggleList({
    listType: taskListNodeType,
    listItemType: taskListItemNodeType,
  })(context.editorView.state);

  const activeOrderedList = !!findParentNode(
    (node) => node.type === taskListNodeType,
  )(context.editorView.state.selection);

  const onTaskListClick = (): void => {
    toggleList({
      listType: taskListNodeType,
      listItemType: taskListItemNodeType,
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
