import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
export const EDIM_BLOCKQUOTE_NODES: Record<string, NodeSpec> = {
  blockquote: {
    content: 'paragraph+',
    group: 'block disable-paragraph-attributes',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM;
    },
  },
};
