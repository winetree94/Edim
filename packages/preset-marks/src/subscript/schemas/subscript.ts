import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const subscriptDOM: DOMOutputSpec = ['sub', 0];
export const PMP_SUBSCRIPT_MARK: Record<string, MarkSpec> = {
  subscript: {
    parseDOM: [{ tag: 'sub' }],
    excludes: 'superscript',
    toDOM() {
      return subscriptDOM;
    },
  },
};
