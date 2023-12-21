import { Attrs, Mark, MarkType } from 'prosemirror-model';

/**
 * Returns the presence of the specified MarkType within the current selection range.
 * It returns true only when attrs are also specified and all attrs are identical.
 *
 * @param marks Mark[]
 * @param type MarkType
 * @param attrs Attrs
 * @returns Mark
 */
export const isInMarks = (
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
