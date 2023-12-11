import { keymap } from 'prosemirror-keymap';
import { indentListItem, listItemBackspace, splitListItem } from '../commands';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export interface EdimFlatListKeymapPluginConfigs {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createEdimFlatListKeymapPlugins = (
  configs: EdimFlatListKeymapPluginConfigs,
): EDIMlugin[] => {
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
