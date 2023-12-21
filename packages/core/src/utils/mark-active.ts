import { Attrs, MarkType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export const markActive = (state: EditorState, type: MarkType) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
};

export const markActiveWithAttrs = (
  state: EditorState,
  type: MarkType,
  attrs?: Attrs | null,
  attrsComparator?: (a: Attrs | null, b: Attrs | null) => boolean,
) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    const marks = state.storedMarks || $from.marks();
    return !!type.isInSet(marks);
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
};
