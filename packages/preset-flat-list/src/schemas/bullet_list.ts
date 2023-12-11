import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from '@edim-editor/core';

export const EDIM_BULLET_FREE_LIST_NODES: Record<string, NodeSpec> = {
  bullet_list: {
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
};
