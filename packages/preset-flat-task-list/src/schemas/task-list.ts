import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from '@edim-editor/core';

export const EDIM_FLAT_TASK_LIST_NODES: Record<string, NodeSpec> = {
  task_list: {
    parseDOM: [
      {
        tag: 'ul',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          if (isQuillTaskList(dom)) {
            return {};
          }
          if (dom.classList.contains('edim-task-list')) {
            return {};
          }
          return false;
        },
      },
    ],
    content: 'task_list_item*',
    group: 'block list',
    toDOM() {
      return [
        'ul',
        {
          class: 'edim-task-list',
        },
        0,
      ];
    },
  },
};
