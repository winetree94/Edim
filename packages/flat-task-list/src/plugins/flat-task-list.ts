import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';
import { edimTaskListInputRulePlugins } from './input-rules';
import { edimFlatTaskListKeymapPlugins } from './keymaps';

export interface EdimFlatTaskListPluginConfigs {
  taskListNodeType: NodeType;
  taskListItemNodeType: NodeType;
}

export const edimFlatTaskListPlugins = (
  configs: EdimFlatTaskListPluginConfigs,
): PMPlugin[] => {
  return [
    ...edimTaskListInputRulePlugins({
      taskListNodeType: configs.taskListNodeType,
    }),
    ...edimFlatTaskListKeymapPlugins({
      taskListNodeType: configs.taskListNodeType,
      taskListItemNodeType: configs.taskListItemNodeType,
    }),
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.taskListNodeType,
        },
      ],
    }),
  ];
};
