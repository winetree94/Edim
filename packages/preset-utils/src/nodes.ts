import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export const findParentNode = (
  editorState: EditorState,
  from: number,
  matcher: (node: Node, parent: Node | null) => boolean,
): {
  node: Node;
  pos: number;
  depth: number;
  parent: Node | null;
} | null => {
  const $pos = editorState.doc.resolve(from);
  let depth = $pos.depth;

  while (depth >= 0) {
    const node = $pos.node(depth);
    const pos = depth <= 0 ? 0 : $pos.before(depth);
    const parent = depth <= 0 ? null : $pos.node(depth - 1);
    if (node && matcher(node, parent)) {
      return {
        node,
        pos,
        depth,
        parent,
      };
    }
    depth -= 1;
  }

  return null;
};
