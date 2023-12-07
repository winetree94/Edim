import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const superscriptDOM: DOMOutputSpec = ['sup', 0];
export const PMP_SUPERSCRIPT_MARK: Record<string, MarkSpec> = {
  superscript: {
    parseDOM: [{ tag: 'sup' }],
    toDOM() {
      return superscriptDOM;
    },
  },
};
