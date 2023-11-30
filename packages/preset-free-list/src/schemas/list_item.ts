import { NodeSpec } from 'prosemirror-model';

export interface ListItemAttrs {
  indent: number;
}

export const PMP_FREE_LIST_ITEM_NODE: Record<string, NodeSpec> = {
  list_item: {
    content: 'paragraph',
    group: 'disable-paragraph-attributes',
    selectable: false,
    attrs: {
      indent: {
        default: 1,
      },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs(node) {
          const dom = node as HTMLElement;
          let indent = dom.dataset['indent'];
          const googleDocIndent = dom.getAttribute('aria-level');
          indent = googleDocIndent || indent;

          let legacyIndent = 0;
          for (let i = 1; i <= 4; i++) {
            legacyIndent = dom.classList.contains(`ql-indent-${i}`)
              ? i + 1
              : legacyIndent;
          }

          return {
            indent: legacyIndent || indent || 1,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ListItemAttrs;
      return [
        'li',
        {
          class: `pmp-list-item pmp-list-item-indent-${attrs.indent || 1}`,
          'data-indent': attrs.indent || 1,
        },
        0,
      ];
    },
    defining: true,
  },
};
