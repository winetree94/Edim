import { keymap } from 'prosemirror-keymap';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import {
  splitListItem,
  indentListItem,
  listItemBackspace,
} from '@edim-editor/flat-list';
import { checkTaskListNodeType } from '../utils';

export interface EdimFlatTaskListKeymapPluginConfigs {
  taskListNodeType?: NodeType;
  taskListItemNodeType?: NodeType;
}

export const edimFlatTaskListKeymapPlugins = (
  configs?: EdimFlatTaskListKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      Enter: splitListItem(
        checkTaskListNodeType(configs?.taskListItemNodeType),
      ),
      'Shift-Enter': splitListItem(
        checkTaskListNodeType(configs?.taskListItemNodeType),
      ),
      Tab: indentListItem({
        listNodeTypes: [checkTaskListNodeType(configs?.taskListNodeType)],
        listItemNodeType: checkTaskListNodeType(configs?.taskListItemNodeType),
        reduce: 1,
      }),
      'Shift-Tab': indentListItem({
        listNodeTypes: [checkTaskListNodeType(configs?.taskListNodeType)],
        listItemNodeType: checkTaskListNodeType(configs?.taskListItemNodeType),
        reduce: -1,
      }),
      Backspace: listItemBackspace({
        listNodeTypes: [checkTaskListNodeType(configs?.taskListNodeType)],
        listItemNodeType: checkTaskListNodeType(configs?.taskListItemNodeType),
      }),
    }),
  ];
};
