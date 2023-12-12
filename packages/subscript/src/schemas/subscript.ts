import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

export const EDIM_SUBSCRIPT_MARK_NAME = 'subscript';

const subscriptDOM: DOMOutputSpec = ['sub', 0];
export const edimSubscriptMarks = (): Record<string, MarkSpec> => ({
  [EDIM_SUBSCRIPT_MARK_NAME]: {
    parseDOM: [{ tag: 'sub' }],
    excludes: 'superscript',
    toDOM() {
      return subscriptDOM;
    },
  },
});
