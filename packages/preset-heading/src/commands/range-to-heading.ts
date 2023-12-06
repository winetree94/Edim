import { Command } from 'prosemirror-state';
import { getBlockContainerChildren, liftOut } from 'prosemirror-preset-core';
import { NodeType } from 'prosemirror-model';

export const transformRangeToHeading =
  (nodeType: NodeType, level: number): Command =>
  (state, dispatch) => {
    let tr = state.tr;
    let selection = state.selection;

    const liftOutResult = liftOut(tr, state, selection.from, selection.to);
    tr = liftOutResult.tr;
    selection = state.selection.map(tr.doc, tr.mapping);

    tr = getBlockContainerChildren(tr.doc, selection.from, selection.to)
      .slice()
      .reverse()
      .reduce((tr, { node, pos }) => {
        if (!nodeType.validContent(node.content)) {
          return tr;
        }
        tr.setBlockType(pos, pos + node.nodeSize, nodeType, { level });
        return tr;
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    dispatch?.(tr.setSelection(selection));
    return true;
  };
