import { Command, Transaction } from 'prosemirror-state';
import { NodePair } from 'prosemirror-preset-core';
import { Attrs } from 'prosemirror-model';

export type TextAlignment = 'left' | 'right' | 'center';

export const setAlignment = (align: TextAlignment): Command => {
  return (state, dispatch) => {
    let selection = state.selection;
    let tr = state.tr;
    const { from, to } = state.selection;

    const targetNodes: NodePair[] = [];
    state.doc.nodesBetween(from, to, (node, pos, parent) => {
      if (node.type.spec.attrs?.['align']) {
        targetNodes.push({ node, pos, parent });
        return false;
      }
      return true;
    });

    if (targetNodes.length === 0) {
      return false;
    }

    tr = targetNodes.reduce<Transaction>((tr, { node, pos }) => {
      return tr.setNodeMarkup(pos, undefined, <Attrs>{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...(node.attrs || {}),
        align: align,
      });
    }, tr);

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection));

    return true;
  };
};
