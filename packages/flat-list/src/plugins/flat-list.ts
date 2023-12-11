import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';
import { edimFlatListInputRulePlugins } from './input-rules';
import { edimFlatListKeymapPlugins } from './keymaps';

export interface EdimFlatListPluginConfigs {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const edimFlatListPlugins = (
  configs: EdimFlatListPluginConfigs,
): PMPlugin[] => {
  return [
    ...edimFlatListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
    }),
    ...edimFlatListKeymapPlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
      listItemNodeType: configs.listItemNodeType,
    }),
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.bulletListNodeType,
        },
        {
          nodeType: configs.orderListNodeType,
        },
      ],
    }),
  ];
};
