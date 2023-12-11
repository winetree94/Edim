import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const subscriptDOM: DOMOutputSpec = ['sub', 0];
export const EDIM_SUBSCRIPT_MARKS: Record<string, MarkSpec> = {
  subscript: {
    parseDOM: [{ tag: 'sub' }],
    excludes: 'superscript',
    toDOM() {
      return subscriptDOM;
    },
  },
};
