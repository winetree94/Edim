import { NodeSpec } from 'prosemirror-model';

export const PMP_PARAGRAPH_NODE: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [
      { tag: 'p' },
    ],
    toDOM(node) {
      return ['p', 0];
    },
  },
};
