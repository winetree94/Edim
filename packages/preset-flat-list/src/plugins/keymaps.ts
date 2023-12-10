import { keymap } from 'prosemirror-keymap';
import { indentListItem, listItemBackspace, splitListItem } from '../commands';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export interface PmpFlatListKeymapPluginConfigs {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpFlatListKeymapPlugins = (
  configs: PmpFlatListKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      Enter: splitListItem(configs.listItemNodeType),
      'Shift-Enter': splitListItem(configs.listItemNodeType),
      Tab: indentListItem({
        listNodeTypes: [configs.bulletListNodeType, configs.orderListNodeType],
        listItemNodeType: configs.listItemNodeType,
        reduce: 1,
      }),
      'Shift-Tab': indentListItem({
        listNodeTypes: [configs.bulletListNodeType, configs.orderListNodeType],
        listItemNodeType: configs.listItemNodeType,
        reduce: -1,
      }),
      Backspace: listItemBackspace({
        listNodeTypes: [configs.bulletListNodeType, configs.orderListNodeType],
        listItemNodeType: configs.listItemNodeType,
      }),
    }),
  ];
};
