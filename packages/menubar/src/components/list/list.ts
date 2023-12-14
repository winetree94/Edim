import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, EdimSeparator, html } from '@edim-editor/ui';
import {
  EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
  EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME,
  EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
  indentListItem,
  toggleList,
} from '@edim-editor/flat-list';
import { findParentNode } from 'prosemirror-utils';

export const EdimMenubarListToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  const orderedListNodeType =
    context.editorState.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME];
  const bulletListNodeType =
    context.editorState.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME];
  const listItemNodeType =
    context.editorState.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME];

  if ((!orderedListNodeType && !bulletListNodeType) || !listItemNodeType) {
    return null;
  }

  const canOrderedList =
    orderedListNodeType &&
    toggleList({
      listType: orderedListNodeType,
      listItemType: listItemNodeType,
    })(context.editorView.state);

  const canBulletList =
    bulletListNodeType &&
    toggleList({
      listType: bulletListNodeType,
      listItemType: listItemNodeType,
    })(context.editorView.state);

  const activeOrderedList =
    orderedListNodeType &&
    !!findParentNode((node) => node.type === orderedListNodeType)(
      context.editorView.state.selection,
    );

  const activeUnorderedList =
    bulletListNodeType &&
    !!findParentNode((node) => node.type === bulletListNodeType)(
      context.editorView.state.selection,
    );

  const onOrderedListClick = (): void => {
    toggleList({
      listType: orderedListNodeType,
      listItemType: listItemNodeType,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  const onUnorderedListClick = (): void => {
    toggleList({
      listType: bulletListNodeType,
      listItemType: listItemNodeType,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  const onIncreaseIndentClick = (): void => {
    indentListItem({
      listNodeTypes: [bulletListNodeType, orderedListNodeType],
      listItemNodeType: listItemNodeType,
      reduce: 1,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  const onDecreaseIndentClick = (): void => {
    indentListItem({
      listNodeTypes: [bulletListNodeType, orderedListNodeType],
      listItemNodeType: listItemNodeType,
      reduce: -1,
    })(context.editorView.state, context.editorView.dispatch);
    context.editorView.focus();
  };

  return html`
    ${
      orderedListNodeType &&
      html`
      <${EdimButton}
        className="edim-icon-button ${activeOrderedList ? 'selected' : ''}"
        disabled=${!canOrderedList}
        onClick=${() => onOrderedListClick()}
        >
        <i className="ri-list-ordered" />
      </${EdimButton}>
    `
    }
    ${
      bulletListNodeType &&
      html`
      <${EdimButton}
        className="edim-icon-button ${activeUnorderedList ? 'selected' : ''}"
        disabled=${!canBulletList}
        onClick=${() => onUnorderedListClick()}
        >
        <i className="ri-list-unordered" />
      </${EdimButton}>
    `
    }
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
    <${EdimSeparator} className="edim-view-menubar-separator" />
  `;
};
