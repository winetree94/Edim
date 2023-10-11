import { Attrs, Node, NodeType } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { findWrapping, liftTarget } from 'prosemirror-transform';

export const lift = (state: EditorState, tr: Transaction) => {
  const { $from, $to } = state.selection;
  const range = $from.blockRange($to);
  const target = range && liftTarget(range);
  if (!range || target === null) {
    throw new Error('Cannot lift');
  }
  return tr.lift(range, target);
};

export const wrapIn = (
  state: EditorState,
  tr: Transaction,
  nodeType: NodeType,
  attrs?: Attrs | null,
) => {
  const { $from, $to } = state.selection;
  const range = $from.blockRange($to),
    wrapping = range && findWrapping(range, nodeType, attrs);
  if (!wrapping) {
    throw new Error('Cannot Wrap In');
  }
  return tr.wrap(range, wrapping);
};

export const findParentNode = (
  editorState: EditorState,
  nodeType: NodeType,
): Node | null => {
  const { selection } = editorState;
  const { from } = selection;

  const pos = editorState.doc.resolve(from);
  let depth = pos.depth;

  while (depth > 0) {
    const node = pos.node(depth);
    if (node && node.type.name === nodeType.name) {
      return node;
    }
    depth -= 1;
  }

  return null;
};
