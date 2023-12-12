import { keymap } from 'prosemirror-keymap';
import { indentListItem, listItemBackspace, splitListItem } from '../commands';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import {
  checkBulletListNodeType,
  checkListItemNodeType,
  checkOrderedListNodeType,
} from '../utils';

export interface EdimFlatListKeymapPluginConfigs {
  orderListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
  listItemNodeType?: NodeType;
}

export const edimFlatListKeymapPlugins = (
  configs?: EdimFlatListKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      Enter: splitListItem(checkListItemNodeType(configs?.listItemNodeType)),
      'Shift-Enter': splitListItem(
        checkListItemNodeType(configs?.listItemNodeType),
      ),
      Tab: indentListItem({
        listNodeTypes: [
          checkBulletListNodeType(configs?.bulletListNodeType),
          checkOrderedListNodeType(configs?.orderListNodeType),
        ],
        listItemNodeType: checkListItemNodeType(configs?.listItemNodeType),
        reduce: 1,
      }),
      'Shift-Tab': indentListItem({
        listNodeTypes: [
          checkBulletListNodeType(configs?.bulletListNodeType),
          checkOrderedListNodeType(configs?.orderListNodeType),
        ],
        listItemNodeType: checkListItemNodeType(configs?.listItemNodeType),
        reduce: -1,
      }),
      Backspace: listItemBackspace({
        listNodeTypes: [
          checkBulletListNodeType(configs?.bulletListNodeType),
          checkOrderedListNodeType(configs?.orderListNodeType),
        ],
        listItemNodeType: checkListItemNodeType(configs?.listItemNodeType),
      }),
    }),
  ];
};
