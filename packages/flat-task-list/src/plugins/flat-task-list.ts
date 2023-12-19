import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimTaskListInputRulePlugins } from './input-rules';
import { edimFlatTaskListKeymapPlugins } from './keymaps';
import { edimFlatTaskListMergePlugins } from './merge';

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
    ...edimFlatTaskListMergePlugins({
      taskListNodeType: configs.taskListNodeType,
    }),
  ];
};
