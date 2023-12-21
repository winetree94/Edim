import { MarkType } from 'prosemirror-model';
import { toggleMarkWithAttrs } from '@edim-editor/core';
import { EdimFontFamilyAttrs } from '../schemas';
import { Command } from 'prosemirror-state';

export const toggleFontFamily = (
  markType: MarkType,
  attr: EdimFontFamilyAttrs,
): Command => {
  return toggleMarkWithAttrs(markType, attr, {
    removeWhenPresent: false,
    attrComparator(a, b) {
      return (
        (a as null | EdimFontFamilyAttrs)?.['fontFamily'] ===
        (b as null | EdimFontFamilyAttrs)?.['fontFamily']
      );
    },
  });
};
