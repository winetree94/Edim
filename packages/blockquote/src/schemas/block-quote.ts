import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_BLOCKQUOTE_NODE_NAME = 'blockquote';

const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
export const edimBlockquoteNodes = (): Record<string, NodeSpec> => ({
  [EDIM_BLOCKQUOTE_NODE_NAME]: {
    content: 'paragraph+',
    group: 'block disable-paragraph-attributes',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM;
    },
  },
});
