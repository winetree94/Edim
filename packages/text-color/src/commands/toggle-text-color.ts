import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { toggleMarkWithAttrs } from '@edim-editor/core';
import { EdimTextColorAttrs } from 'schemas';

export const toggleTextColorMark = (
  markType: MarkType,
  attrs: EdimTextColorAttrs,
): Command => toggleMark(markType, attrs);

export const toggleTextColorWithAttrs = (
  markType: MarkType,
  attr: EdimTextColorAttrs,
): Command => {
  return toggleMarkWithAttrs(markType, attr);
};
