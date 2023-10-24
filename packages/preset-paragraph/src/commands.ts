import { Command, EditorState, Transaction } from 'prosemirror-state';
import { NodePair } from 'prosemirror-preset-utils';
import { Attrs, Node } from 'prosemirror-model';

export const setAlignment = (align: 'left' | 'right' | 'center'): Command => {
  return (state, dispatch) => {
    let selection = state.selection;
    let tr = state.tr;
    const { from, to } = state.selection;

    const targetNodes: NodePair[] = [];
    state.doc.nodesBetween(from, to, (node, pos, parent) => {
      if (node.type.spec.group?.includes('disable-paragraph-attributes')) {
        return false;
      }
      if (node.type.spec.attrs?.['textAlign']) {
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
        textAlign: align,
      });
    }, tr);

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection));

    return true;
  };
};

export const getRangeFirstAlignment = (state: EditorState) => {
  const { from, to } = state.selection;
  const aligns: ('left' | 'right' | 'center')[] = [];
  state.doc.nodesBetween(from, to, (node) => {
    if (node.type.spec.group?.includes('disable-paragraph-attributes')) {
      return false;
    }
    if (node.type.spec.attrs?.['textAlign']) {
      aligns.push(node.attrs['textAlign'] as 'left' | 'right' | 'center');
      return false;
    }
    return true;
  });
  return aligns.length === 0 ? null : aligns[0];
};

export const getRangeIsText = (state: EditorState) => {
  const { $from, $to } = state.selection;

  const range = $from.blockRange(
    $to,
    (node) => node.type.spec.group?.includes('block-container') || false,
  );

  if (!range) {
    return false;
  }

  const descendents: Node[] = [];
  state.doc.nodesBetween($from.pos, $to.pos, (node, pos, parent) => {
    if (parent === range.parent) {
      descendents.push(node);
    }
    return true;
  });

  return descendents.every((node) =>
    ['heading', 'paragraph'].includes(node.type.name),
  );
};

export const indentFirstRange = (incremental: number): Command => {
  return (state, dispatch) => {
    const { $from, $to } = state.selection;

    const range = $from.blockRange(
      $to,
      (node) => node.type.spec.group?.includes('block-container') || false,
    );

    if (!range) {
      return false;
    }

    const descendentsNodes: NodePair[] = [];
    state.doc.nodesBetween($from.pos, $to.pos, (node, pos, parent) => {
      if (parent === range.parent) {
        descendentsNodes.push({
          node,
          pos,
          parent,
        });
      }
      return true;
    });

    if (descendentsNodes.length === 0) {
      return false;
    }

    return false;
  };
};
