import { NodeSpec } from 'prosemirror-model';
import { parseQuillIndent, parseQuillTextAlign } from 'prosemirror-preset-core';

export interface ListItemAttrs {
  indent: number;
  align: 'left' | 'right' | 'center' | null;
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
      align: {
        default: 'left',
      },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs(node) {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const quillAlign = parseQuillTextAlign(dom);
          const indent = dom.dataset['indent'];
          const quillIndent = parseQuillIndent(dom);

          return {
            align: align || quillAlign || null,
            indent: indent || quillIndent || 1,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ListItemAttrs;
      return [
        'li',
        {
          class: `pmp-list-item pmp-list-item-indent-${attrs.indent || 1} ${
            attrs.align ? ` pmp-align-${attrs.align}` : ''
          }`,
          'data-text-align': attrs.align || 'left',
          'data-indent': attrs.indent || 1,
        },
        0,
      ];
    },
    defining: true,
  },
};
