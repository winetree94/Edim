import { PmpFontFamilyAttrs } from 'prosemirror-preset-marks/font-family';
import { EditorState, TextSelection } from 'prosemirror-state';

export const currentFontFamily = (state: EditorState) => {
  const selection = state.selection;
  if (selection.$from.parent !== selection.$to.parent) {
    return 'default';
  }

  if (!(selection instanceof TextSelection)) {
    return 'default';
  }

  const storedFont = state.storedMarks?.find(
    (mark) => mark.type === state.schema.marks['font_family'],
  )?.attrs as PmpFontFamilyAttrs;

  if (storedFont) {
    return storedFont.fontFamily;
  }

  const fromFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['font_family'])
    ?.attrs as PmpFontFamilyAttrs;

  const toFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['font_family'])
    ?.attrs as PmpFontFamilyAttrs;

  if (!fromFont || !toFont) {
    return 'default';
  }

  console.log(fromFont, toFont);

  if (fromFont.fontFamily !== toFont.fontFamily) {
    return 'default';
  }

  return fromFont.fontFamily;
};
