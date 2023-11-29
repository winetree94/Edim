import { EditorState, Transaction } from 'prosemirror-state';

export function deleteTable(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
): boolean {
  const $pos = state.selection.$anchor;
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    if (node.type.spec['tableRole'] == 'table') {
      if (dispatch) {
        dispatch(
          state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView(),
        );
      }
      return true;
    }
  }
  return false;
}
