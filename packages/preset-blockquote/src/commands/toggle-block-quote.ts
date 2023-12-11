import { Command } from 'prosemirror-state';
import { NodePair } from '@edim-editor/core';

export const toggleBlockquote = (): Command => {
  return (state, dispatch) => {
    const selection = state.selection;
    const tr = state.tr;

    const range = selection.$from.blockRange(
      selection.$to,
      (node) => node.type.spec.group?.includes('block-container') || false,
    );

    if (!range) {
      return false;
    }

    const descendants: NodePair[] = [];
    tr.doc.nodesBetween(selection.from, selection.to, (node, pos, parent) => {
      if (parent === range.parent) {
        descendants.push({
          node,
          pos,
          parent,
        });
        return false;
      }
      return true;
    });

    return false;
  };
};
