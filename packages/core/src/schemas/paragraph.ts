import { NodeSpec } from 'prosemirror-model';

export const EDIM_PARAGRAPH_NODE: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM(node) {
      return ['p', 0];
    },
  },
};
