import { NodeType } from 'prosemirror-model';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { createEdimMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createEdimTaskListInputRulePlugins } from './input-rules';
import { createEdimFlatTaskListKeymapPlugins } from './keymaps';

export interface EdimFlatTaskListPluginsConfig {
  taskListNodeType: NodeType;
  taskListItemNodeType: NodeType;
}

export const createEdimFlatTaskListPlugins = (
  configs: EdimFlatTaskListPluginsConfig,
): EDIMlugin[] => {
  return [
    ...createEdimTaskListInputRulePlugins({
      taskListNodeType: configs.taskListNodeType,
    }),
    ...createEdimFlatTaskListKeymapPlugins({
      taskListNodeType: configs.taskListNodeType,
      taskListItemNodeType: configs.taskListItemNodeType,
    }),
    ...createEdimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.taskListNodeType,
        },
      ],
    }),
  ];
};
