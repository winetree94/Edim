import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME = 'ordered_list';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'edim-ordered-list',
  },
  0,
];

export const edimFlatOrderedListNodes = (): Record<string, NodeSpec> => ({
  [EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME]: {
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
});
