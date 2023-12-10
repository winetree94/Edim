import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from 'prosemirror-preset-core';

export const PMP_BULLET_FREE_LIST_NODE: Record<string, NodeSpec> = {
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
          class: 'pmp-bullet-list',
        },
        0,
      ];
    },
  },
};
