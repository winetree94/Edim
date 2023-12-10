import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createPmpTaskListInputRulePlugins } from './input-rules';
import { createPmpFlatTaskListKeymapPlugins } from './keymaps';

export interface PmpFlatTaskListPluginsConfig {
  taskListNodeType: NodeType;
  taskListItemNodeType: NodeType;
}

export const createPmpFlatTaskListPlugins = (
  configs: PmpFlatTaskListPluginsConfig,
): PMPlugin[] => {
  return [
    ...createPmpTaskListInputRulePlugins({
      taskListNodeType: configs.taskListNodeType,
    }),
    ...createPmpFlatTaskListKeymapPlugins({
      taskListNodeType: configs.taskListNodeType,
      taskListItemNodeType: configs.taskListItemNodeType,
    }),
    ...createPmpMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.taskListNodeType,
        },
      ],
    }),
  ];
};
