import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_DEFAULT_FLAT_ORDERED_LIST_NODE_NAME = 'ordered_list';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'edim-ordered-list',
  },
  0,
];

export const edimFlatOrderedListNodes = (): Record<string, NodeSpec> => ({
  [EDIM_DEFAULT_FLAT_ORDERED_LIST_NODE_NAME]: {
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
