import { keymap } from 'prosemirror-keymap';
import { indentListItem, listItemBackspace, splitListItem } from '../commands';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export interface EdimFlatListKeymapPluginConfigs {
  orderListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
  listItemNodeType: NodeType;
}

export const edimFlatListKeymapPlugins = (
  configs: EdimFlatListKeymapPluginConfigs,
): PMPlugin[] => {
  const listTypes = [];
  if (configs.bulletListNodeType) {
    listTypes.push(configs.bulletListNodeType);
  }
  if (configs.orderListNodeType) {
    listTypes.push(configs.orderListNodeType);
  }
  return [
    keymap({
      Enter: splitListItem(configs.listItemNodeType),
      'Shift-Enter': splitListItem(configs.listItemNodeType),
      Tab: indentListItem({
        listNodeTypes: listTypes,
        listItemNodeType: configs.listItemNodeType,
        reduce: 1,
      }),
      'Shift-Tab': indentListItem({
        listNodeTypes: listTypes,
        listItemNodeType: configs.listItemNodeType,
        reduce: -1,
      }),
      Backspace: listItemBackspace({
        listNodeTypes: listTypes,
        listItemNodeType: configs.listItemNodeType,
      }),
    }),
  ];
};
