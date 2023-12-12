import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from '@edim-editor/core';

export const EDIM_DEFAULT_FLAT_BULLET_LIST_NODE_NAME = 'bullet_list';

export const edimFlatBulletListNodes = (): Record<string, NodeSpec> => ({
  [EDIM_DEFAULT_FLAT_BULLET_LIST_NODE_NAME]: {
    parseDOM: [
      {
        tag: 'ul',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          if (isQuillTaskList(dom)) {
            return false;
          }
          return {};
        },
      },
    ],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return [
        'ul',
        {
          class: 'edim-bullet-list',
        },
        0,
      ];
    },
  },
});
