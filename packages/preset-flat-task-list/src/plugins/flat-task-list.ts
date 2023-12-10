import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createPmpListInputRulePlugins } from './input-rules';
import { createPmpListKeymapPlugins } from './keymaps';

export interface PmpFlatTaskListPluginsConfig {
  taskListNodeType: NodeType;
  taskListItemNodeType: NodeType;
}

export const createPmpFlatTaskListPlugins = (
  configs: PmpFlatTaskListPluginsConfig,
): PMPlugin[] => {
  return [
    // ...createPmpListInputRulePlugins({
    //   bulletListNodeType: configs.bulletListNodeType,
    //   orderListNodeType: configs.taskListNodeType,
    // }),
    // ...createPmpListKeymapPlugins({
    //   listItemNodeType: configs.taskListItemNodeType,
    // }),
    ...createPmpMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.taskListNodeType,
        },
      ],
    }),
  ];
};
