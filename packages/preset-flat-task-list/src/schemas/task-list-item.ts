import { NodeSpec } from 'prosemirror-model';
import {
  isQuillTaskList,
  parseQuillIndent,
  parseQuillTextAlign,
} from 'prosemirror-preset-core';

export interface ListItemAttrs {
  indent: number;
  align: 'left' | 'right' | 'center' | null;
  checked: boolean;
}

export const PMP_FLAT_TASK_LIST_ITEM_NODES: Record<string, NodeSpec> = {
  task_list_item: {
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
      checked: {
        default: false,
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
          const checked = dom.dataset['checked'];

          if (dom.parentElement && isQuillTaskList(dom.parentElement)) {
            return {
              align: align || quillAlign || null,
              indent: indent || quillIndent || 1,
              checked: dom.parentElement.dataset['checked'] === 'true',
            };
          }

          return {
            align: align || quillAlign || null,
            indent: indent || quillIndent || 1,
            checked: checked,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ListItemAttrs;
      const classes = ['pmp-task-list-item'];
      if (attrs.align && attrs.align !== 'left') {
        classes.push(`pmp-align-${attrs.align}`);
      }
      classes.push(`pmp-indent-${attrs.indent || 1}`);
      if (attrs.checked) {
        classes.push('pmp-task-list-item-checked');
      }
      return [
        'li',
        {
          class: classes.join(' '),
          'data-text-align': attrs.align || 'left',
          'data-indent': attrs.indent || 1,
          'data-checked': attrs.checked ? 'true' : 'false',
        },
        0,
      ];
    },
    defining: true,
  },
};
