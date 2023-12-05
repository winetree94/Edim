import { EditorState, Transaction } from 'prosemirror-state';

export const canAddLink = (state: EditorState): boolean => {
  const { $from, $to } = state.selection;

  if ($from.parent !== $to.parent) {
    return false;
  }

  return $from.parent.isTextblock;
};