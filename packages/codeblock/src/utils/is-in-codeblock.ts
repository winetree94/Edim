import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export const isInCodeBlock = (state: EditorState, nodeType: NodeType) => {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type == nodeType) {
      return true;
    }
  }
  return false;
};
