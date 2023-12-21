import { MarkType } from 'prosemirror-model';
import { toggleMarkWithAttrs } from '@edim-editor/core';
import { Command } from 'prosemirror-state';
import { EdimTextColorAttrs } from 'schemas';

export const toggleTextColor = (
  markType: MarkType,
  attr: EdimTextColorAttrs,
): Command => {
  return toggleMarkWithAttrs(markType, attr, {
    removeWhenPresent: false,
    attrComparator(a, b) {
      return (
        (a as null | EdimTextColorAttrs)?.color ===
        (b as null | EdimTextColorAttrs)?.color
      );
    },
  });
};
