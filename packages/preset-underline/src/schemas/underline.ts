import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const underlineDOM: DOMOutputSpec = ['u', 0];
export const EDIM_UNDERLINE_MARKS: Record<string, MarkSpec> = {
  underline: {
    parseDOM: [{ tag: 'u' }],
    toDOM() {
      return underlineDOM;
    },
  },
};
