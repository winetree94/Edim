import { Command } from 'prosemirror-state';
import { Attrs, NodeType } from 'prosemirror-model';
import { liftOut } from '../transforms';
import { getBlockContainerChildren } from '../utils';

/**
 * Convert all nodes within the current selection to a specific node.
 * This applies only to convertible nodes.
 *
 * @param nodeType
 * @param attrs
 * @returns Command
 */
export const transformRangeToBlock =
  (nodeType: NodeType, attrs?: Attrs): Command =>
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
        tr.setBlockType(pos, pos + node.nodeSize, nodeType, attrs);
        return tr;
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    dispatch?.(tr.setSelection(selection));
    return true;
  };
