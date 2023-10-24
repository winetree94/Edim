import { Attrs, Node, NodeType } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';

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
  from: number,
  nodeType: NodeType,
): {
  node: Node;
  pos: number;
  depth: number;
  parent: Node;
} | null => {
  const pos = editorState.doc.resolve(from);
  let depth = pos.depth;

  while (depth > 0) {
    const node = pos.node(depth);
    if (node && node.type.name === nodeType.name) {
      return {
        node,
        pos: pos.before(depth),
        depth,
        parent: pos.node(depth - 1),
      };
    }
    depth -= 1;
  }

  return null;
};

export const forEachParentNodes = (
  state: EditorState,
  from: number,
  cb: (node: Node, pos: number, parent: Node) => void,
): void => {
  const pos = state.doc.resolve(from);
  let depth = pos.depth;

  while (depth > 0) {
    const node = pos.node(depth);
    if (node) {
      cb(node, pos.before(depth), pos.node(depth - 1));
    }
    depth -= 1;
  }
};
