import { NodeSpec } from 'prosemirror-model';
import {
  isQuillTaskList,
  parseQuillIndent,
  parseQuillTextAlign,
} from '@edim-editor/core';
import { createNode } from '../utils';

export const EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME = 'task_list_item';

export interface EdimFlatTaskListItemAttrs {
  indent: number;
  align: 'left' | 'right' | 'center' | null;
  checked: boolean;
}

export interface EdimFlatTaskListItemNodeConfigs {
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimFlatTaskListItemNodeConfigs> = {
  nodeName: EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME,
};

export const edimFlatTaskListItemNodes = (
  configs?: EdimFlatTaskListItemNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    content: 'paragraph',
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
          const dom = node as HTMLLIElement;
          const align = dom.getAttribute('data-text-align');
          const quillAlign = parseQuillTextAlign(dom);
          const indent = dom.dataset['indent'];
          const quillIndent = parseQuillIndent(dom);
          const checked = dom.dataset['checked'] === 'true';

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
      const li = createNode(node);
      return {
        dom: li,
        contentDOM: li,
      };
      // const attrs = node.attrs as EdimFlatTaskListItemAttrs;
      // const classes = ['edim-task-list-item'];
      // if (attrs.align && attrs.align !== 'left') {
      //   classes.push(`edim-align-${attrs.align}`);
      // }
      // classes.push(`edim-indent-${attrs.indent || 1}`);
      // if (attrs.checked) {
      //   classes.push('edim-task-list-item-checked');
      // }
      // return [
      //   'li',
      //   {
      //     class: classes.join(' '),
      //     'data-text-align': attrs.align || 'left',
      //     'data-indent': attrs.indent || 1,
      //     'data-checked': attrs.checked ? 'true' : 'false',
      //   },
      //   0,
      // ];
    },
    defining: true,
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};
