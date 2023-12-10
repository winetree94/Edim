import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import {
  createPmpTaskListInputRulePlugins,
  createPmpListKeymapPlugins,
} from './plugins';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';

export interface PmpListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpListPlugins = (
  configs: PmpListPluginsConfig,
): PMPlugin[] => {
  return [
    ...createPmpTaskListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderListNodeType,
    }),
    ...createPmpListKeymapPlugins({
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
