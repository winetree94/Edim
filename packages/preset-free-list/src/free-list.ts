import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'pmp-ordered-list',
  },
  0,
];

const ulDOM: DOMOutputSpec = [
  'ul',
  {
    class: 'pmp-bullet-list',
  },
  0,
];

export const orderedList = {
  attrs: {},
  parseDOM: [
    {
      tag: 'ol',
      getAttrs() {
        return {};
      },
    },
  ],
  toDOM() {
    return olDOM;
  },
} as NodeSpec;

export const bulletList: NodeSpec = {
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ulDOM;
  },
};

export interface ListItemAttrs {
  indent: number;
}

export const listItem: NodeSpec = {
  attrs: {
    indent: {
      default: 0,
    },
  },
  parseDOM: [
    {
      tag: 'li',
      getAttrs(node) {
        const dom = node as HTMLElement;
        return {
          indent: dom.getAttribute('data-indent') || 0,
        };
      },
    },
  ],
  toDOM(node) {
    const attrs = node.attrs as ListItemAttrs;
    return [
      'li',
      {
        class: `pmp-list-item pmp-list-item-indent-${attrs.indent || 0}`,
        'data-indent': attrs.indent || 0,
      },
      0,
    ];
  },
  defining: true,
};
