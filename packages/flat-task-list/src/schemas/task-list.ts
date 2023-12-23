import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from '@edim-editor/core';

export const EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME = 'task_list';

export interface EdimFlatTaskListNodeConfigs {
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimFlatTaskListNodeConfigs> = {
  nodeName: EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME,
};

export const edimFlatTaskListNodes = (
  configs?: EdimFlatTaskListNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    parseDOM: [
      {
        tag: 'ul.edim-task-list',
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
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};
