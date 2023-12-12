import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

export const EDIM_SUPERSCRIPT_MARK_NAME = 'superscript';

const superscriptDOM: DOMOutputSpec = ['sup', 0];
export const edimSuperscriptMarks = (): Record<string, MarkSpec> => ({
  [EDIM_SUPERSCRIPT_MARK_NAME]: {
    parseDOM: [{ tag: 'sup' }],
    excludes: 'subscript',
    toDOM() {
      return superscriptDOM;
    },
  },
});
