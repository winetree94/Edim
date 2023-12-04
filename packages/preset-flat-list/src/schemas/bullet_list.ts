import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const ulDOM: DOMOutputSpec = [
  'ul',
  {
    class: 'pmp-bullet-list',
  },
  0,
];

export const PMP_BULLET_FREE_LIST_NODE: Record<string, NodeSpec> = {
  bullet_list: {
    parseDOM: [{ tag: 'ul' }],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return ulDOM;
    },
  },
};
