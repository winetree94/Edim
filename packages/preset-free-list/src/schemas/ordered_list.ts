import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'pmp-ordered-list',
  },
  0,
];

export const PMP_ORDERED_FREE_LIST_NODE: Record<string, NodeSpec> = {
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