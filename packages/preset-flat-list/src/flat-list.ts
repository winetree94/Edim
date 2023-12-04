import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import {
  createPmpListInputRulePlugins,
  createPmpListKeymapPlugins,
} from './plugins';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-utils';

export interface PmpListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpListPlugins = (
  configs: PmpListPluginsConfig,
): PMPlugin[] => {
  return [
    ...createPmpListInputRulePlugins({
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
