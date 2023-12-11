import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const superscriptDOM: DOMOutputSpec = ['sup', 0];
export const EDIM_SUPERSCRIPT_MARKS: Record<string, MarkSpec> = {
  superscript: {
    parseDOM: [{ tag: 'sup' }],
    excludes: 'subscript',
    toDOM() {
      return superscriptDOM;
    },
  },
};
