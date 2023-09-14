import { MarkType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export const markActive = (state: EditorState, type: MarkType) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
};
