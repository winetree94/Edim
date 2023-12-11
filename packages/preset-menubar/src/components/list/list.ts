import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, html } from '@edim-editor/ui';
import { toggleList } from '@edim-editor/flat-list';
import { findParentNode } from 'prosemirror-utils';

export const EdimMenubarListToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  const canOrderedList = toggleList({
    listType: context.editorView.state.schema.nodes['ordered_list'],
    listItemType: context.editorView.state.schema.nodes['list_item'],
  })(context.editorView.state);
  const canBulletList = toggleList({
    listType: context.editorView.state.schema.nodes['bullet_list'],
    listItemType: context.editorView.state.schema.nodes['list_item'],
  })(context.editorView.state);
  const activeOrderedList = !!findParentNode(
    (node) =>
      node.type === context.editorView.state.schema.nodes['ordered_list'],
  )(context.editorView.state.selection);
  const activeUnorderedList = !!findParentNode(
    (node) =>
      node.type === context.editorView.state.schema.nodes['bullet_list'],
  )(context.editorView.state.selection);

  const onOrderedListClick = (): void => {
    toggleList({
      listType: context.editorView.state.schema.nodes['ordered_list'],
      listItemType: context.editorView.state.schema.nodes['list_item'],
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  const onUnorderedListClick = (): void => {
    toggleList({
      listType: context.editorView.state.schema.nodes['bullet_list'],
      listItemType: context.editorView.state.schema.nodes['list_item'],
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  return html`
  <${EdimButton}
  className="edim-icon-button ${activeOrderedList ? 'selected' : ''}"
  disabled=${!canOrderedList}
  onClick=${() => onOrderedListClick()}
  >
  <i className="ri-list-ordered" />
</${EdimButton}>
<${EdimButton}
  className="edim-icon-button ${activeUnorderedList ? 'selected' : ''}"
  disabled=${!canBulletList}
  onClick=${() => onUnorderedListClick()}
  >
  <i className="ri-list-unordered" />
</${EdimButton}>
  `;
};
