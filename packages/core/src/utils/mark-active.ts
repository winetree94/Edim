import { Attrs, Mark, MarkType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

/**
 * Returns the presence of the specified MarkType within the current selection range.
 * It returns true only when attrs are also specified and all attrs are identical.
 *
 * @param marks Mark[]
 * @param type MarkType
 * @param attrs Attrs
 * @returns Mark
 */
export const isInMark = (
  marks: Mark[] | readonly Mark[],
  type: MarkType,
  attrs?: Attrs | null,
): Mark | void => {
  return marks.find((mark) => {
    const sameType = mark.type === type;
    if (!sameType) {
      return false;
    }
    if (attrs === undefined) {
      return sameType;
    } else {
      const sameAttrs = mark.eq(type.create(attrs));
      return sameAttrs;
    }
  });
};

/**
 * Returns the presence of the specified MarkType within the current selection range.
 * It returns true only when attrs are also specified and all attrs are identical.
 *
 * @param state EditorState
 * @param type MarkType
 * @param attrs Attrs
 * @returns Mark
 */
export const markActive = (
  state: EditorState,
  type: MarkType,
  attrs?: Attrs | null,
) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    const marks = state.storedMarks || $from.marks();
    return isInMark(marks, type, attrs);
  } else {
    const marks: Mark[] = [];
    state.doc.nodesBetween(from, to, (node) => {
      if (node.isInline) {
        marks.push(...node.marks);
      }
    });
    return isInMark(marks, type, attrs);
  }
};
