import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

export const EDIM_UNDERLINE_MARK_NAME = 'underline';

const underlineDOM: DOMOutputSpec = ['u', 0];
export const edimUnderlineMarks = (): Record<string, MarkSpec> => ({
  [EDIM_UNDERLINE_MARK_NAME]: {
    parseDOM: [{ tag: 'u' }],
    toDOM() {
      return underlineDOM;
    },
  },
});
