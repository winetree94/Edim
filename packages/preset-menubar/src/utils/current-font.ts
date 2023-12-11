import { markActive } from '@edim-editor/core';
import { EdimFontFamilyAttrs } from '@edim-editor/font-family';
import { EditorState, TextSelection } from 'prosemirror-state';

export const currentFontFamily = (state: EditorState) => {
  const selection = state.selection;

  if (!(selection instanceof TextSelection)) {
    return 'default';
  }

  const actived = markActive(state, state.schema.marks['font_family']);
  if (!actived) {
    return 'default';
  }

  const storedFont = state.storedMarks?.find(
    (mark) => mark.type === state.schema.marks['font_family'],
  )?.attrs as EdimFontFamilyAttrs;

  if (storedFont) {
    return storedFont.fontFamily;
  }

  const fromFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['font_family'])
    ?.attrs as EdimFontFamilyAttrs;

  const toFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['font_family'])
    ?.attrs as EdimFontFamilyAttrs;

  if (!fromFont || !toFont) {
    return 'default';
  }

  if (fromFont.fontFamily !== toFont.fontFamily) {
    return 'default';
  }

  return fromFont.fontFamily;
};
