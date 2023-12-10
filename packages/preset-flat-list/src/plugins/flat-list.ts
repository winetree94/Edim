import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createPmpFlatListInputRulePlugins } from './input-rules';
import { createPmpFlatListKeymapPlugins } from './keymaps';

export interface PmpFlatListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpFlatListPlugins = (
  configs: PmpFlatListPluginsConfig,
): PMPlugin[] => {
  return [
    ...createPmpFlatListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
    }),
    ...createPmpFlatListKeymapPlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
      listItemNodeType: configs.listItemNodeType,
    }),
    ...createPmpMergeAdjacentNodePlugins({
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
