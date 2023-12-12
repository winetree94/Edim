import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const subscriptDOM: DOMOutputSpec = ['sub', 0];
export const edimSubscriptMarks = (): Record<string, MarkSpec> => ({
  subscript: {
    parseDOM: [{ tag: 'sub' }],
    excludes: 'superscript',
    toDOM() {
      return subscriptDOM;
    },
  },
});
