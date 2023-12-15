import { Command, Transaction } from 'prosemirror-state';
import { NodePair } from '../types';
import { Attrs } from 'prosemirror-model';

export const TEXT_ALIGNMENT = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

export type TEXT_ALIGNMENTS =
  (typeof TEXT_ALIGNMENT)[keyof typeof TEXT_ALIGNMENT];

export const setTextAlign = (align: TEXT_ALIGNMENTS | null): Command => {
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
        ...(node.attrs || {}),
        align: align,
      });
    }, tr);

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection));

    return true;
  };
};
