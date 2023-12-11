import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'edim-ordered-list',
  },
  0,
];

export const EDIM_ORDERED_FREE_LIST_NODES: Record<string, NodeSpec> = {
  ordered_list: {
    parseDOM: [
      {
        tag: 'ol',
        getAttrs() {
          return {};
        },
      },
    ],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return olDOM;
    },
  },
};
