import { NodeSpec } from 'prosemirror-model';
import {
  isQuillTaskList,
  parseQuillIndent,
  parseQuillTextAlign,
} from 'prosemirror-preset-core';

export interface ListItemAttrs {
  indent: number;
  align: 'left' | 'right' | 'center' | null;
}

export const EDIM_FREE_LIST_ITEM_NODES: Record<string, NodeSpec> = {
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

          if (dom.parentElement && isQuillTaskList(dom.parentElement)) {
            return false;
          }

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
          class: `edim-list-item edim-list-item-indent-${attrs.indent || 1} ${
            attrs.align ? ` edim-align-${attrs.align}` : ''
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
