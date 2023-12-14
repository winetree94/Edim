import { keymap } from 'prosemirror-keymap';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import {
  splitListItem,
  indentListItem,
  listItemBackspace,
} from '@edim-editor/flat-list';

export interface EdimFlatTaskListKeymapPluginConfigs {
  taskListNodeType: NodeType;
  taskListItemNodeType: NodeType;
}

export const edimFlatTaskListKeymapPlugins = (
  configs: EdimFlatTaskListKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      Enter: splitListItem(configs.taskListItemNodeType),
      'Shift-Enter': splitListItem(configs.taskListItemNodeType),
      Tab: indentListItem({
        listNodeTypes: [configs.taskListNodeType],
        listItemNodeType: configs.taskListItemNodeType,
        reduce: 1,
      }),
      'Shift-Tab': indentListItem({
        listNodeTypes: [configs.taskListNodeType],
        listItemNodeType: configs.taskListItemNodeType,
        reduce: -1,
      }),
      Backspace: listItemBackspace({
        listNodeTypes: [configs.taskListNodeType],
        listItemNodeType: configs.taskListItemNodeType,
      }),
    }),
  ];
};
