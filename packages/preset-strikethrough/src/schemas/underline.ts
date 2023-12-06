import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const underlineDOM: DOMOutputSpec = ['u', 0];
export const PMP_UNDERLINE_MARK: Record<string, MarkSpec> = {
  underline: {
    parseDOM: [{ tag: 'u' }],
    toDOM() {
      return underlineDOM;
    },
  },
};