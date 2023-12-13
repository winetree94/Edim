import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimButton, html } from '@edim-editor/ui';
import {
  checkBulletListNodeType,
  checkListItemNodeType,
  checkOrderedListNodeType,
  toggleList,
} from '@edim-editor/flat-list';
import { findParentNode } from 'prosemirror-utils';

export const EdimMenubarListToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  const orderedListNodeType = checkOrderedListNodeType(
    context.options?.flatOrderedListNodeType,
  )(context.editorView.state);

  const bulletListNodeType = checkBulletListNodeType(
    context.options?.flatBulletListNodeType,
  )(context.editorView.state);

  const listItemNodeType = checkListItemNodeType(
    context.options?.flatListItemNodeType,
  )(context.editorView.state);

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

  return html`
    ${orderedListNodeType &&
    html`
      <${EdimButton}
        className="edim-icon-button ${activeOrderedList ? 'selected' : ''}"
        disabled=${!canOrderedList}
        onClick=${() => onOrderedListClick()}
        >
        <i className="ri-list-ordered" />
      </${EdimButton}>
    `}
    ${bulletListNodeType &&
    html`
      <${EdimButton}
        className="edim-icon-button ${activeUnorderedList ? 'selected' : ''}"
        disabled=${!canBulletList}
        onClick=${() => onUnorderedListClick()}
        >
        <i className="ri-list-unordered" />
      </${EdimButton}>
    `}
  `;
};
