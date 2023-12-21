import { MarkType } from 'prosemirror-model';
import { toggleMarkWithAttrs } from '@edim-editor/core';
import { EdimFontFamilyAttrs } from '../schemas';
import { Command } from 'prosemirror-state';

export const toggleFontFamily = (
  markType: MarkType,
  attr: EdimFontFamilyAttrs,
): Command => {
  return toggleMarkWithAttrs(markType, attr);
};
