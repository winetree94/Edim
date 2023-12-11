import { NodeType } from 'prosemirror-model';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { createEdimMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createEdimFlatListInputRulePlugins } from './input-rules';
import { createEdimFlatListKeymapPlugins } from './keymaps';

export interface EdimFlatListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createEdimFlatListPlugins = (
  configs: EdimFlatListPluginsConfig,
): EDIMlugin[] => {
  return [
    ...createEdimFlatListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
    }),
    ...createEdimFlatListKeymapPlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
      listItemNodeType: configs.listItemNodeType,
    }),
    ...createEdimMergeAdjacentNodePlugins({
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
