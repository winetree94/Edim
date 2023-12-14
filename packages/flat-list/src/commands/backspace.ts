import { Command, TextSelection } from 'prosemirror-state';
import { indentListItem } from './indent-list-item';
import { findParentNode } from 'prosemirror-utils';
import { NodeType } from 'prosemirror-model';

export interface EdimListItemBackspaceCommandConfigs {
  listNodeTypes: NodeType[];
  listItemNodeType: NodeType;
}

export const listItemBackspace =
  (configs: EdimListItemBackspaceCommandConfigs): Command =>
  (state, dispatch) => {
    const listItemNodeType = configs.listItemNodeType;
    const selection = state.selection;
    if (selection.from !== selection.to) {
      return false;
    }
    const previous$ = state.doc.resolve(selection.from - 1);
    if (previous$.parent.type === listItemNodeType) {
      indentListItem({
        listNodeTypes: configs.listNodeTypes,
        listItemNodeType: listItemNodeType,
        reduce: -1,
      })(state, dispatch);
      return true;
    }
    const currentBlock = findParentNode((node) => node.type.isBlock)(selection);
    if (
      currentBlock &&
      previous$.nodeBefore &&
      configs.listNodeTypes.includes(previous$.nodeBefore.type)
    ) {
      const lastListItem$ = state.tr.doc.resolve(selection.from - 3);
      const lastListItemPos = lastListItem$.before(lastListItem$.depth);
      let tr = state.tr.delete(
        currentBlock.pos,
        currentBlock.pos + currentBlock.node.nodeSize,
      );
      const insertPosition =
        lastListItemPos + lastListItem$.parent.nodeSize - 2;
      tr = tr.insert(insertPosition, currentBlock.node.content);
      tr = tr.setSelection(TextSelection.create(tr.doc, insertPosition));
      dispatch?.(tr);
      return true;
    }
    return false;
  };
