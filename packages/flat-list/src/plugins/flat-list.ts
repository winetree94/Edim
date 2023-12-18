import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';
import { edimFlatListInputRulePlugins } from './input-rules';
import { edimFlatListKeymapPlugins } from './keymaps';
import { EdimMergeAdjacentNodePluginConfigs } from '@edim-editor/core';

export interface EdimFlatListPluginConfigs {
  orderedListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
  listItemNodeType: NodeType;
}

export const edimFlatListPlugins = (
  configs: EdimFlatListPluginConfigs,
): PMPlugin[] => {
  const mergeConfigs: EdimMergeAdjacentNodePluginConfigs = {
    specs: [],
  };

  if (configs.bulletListNodeType) {
    mergeConfigs.specs.push({
      nodeType: configs.bulletListNodeType,
    });
  }

  if (configs.orderedListNodeType) {
    mergeConfigs.specs.push({
      nodeType: configs.orderedListNodeType,
    });
  }

  return [
    ...edimFlatListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderedListNodeType,
    }),
    ...edimFlatListKeymapPlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderedListNodeType,
      listItemNodeType: configs.listItemNodeType,
    }),
    ...edimMergeAdjacentNodePlugins(mergeConfigs),
  ];
};
