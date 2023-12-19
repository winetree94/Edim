import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';
import { EdimMergeAdjacentNodePluginConfigs } from '@edim-editor/core';

export interface EdimFlatListMergePluginConfigs {
  orderedListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
}

export const edimFlatListMergePlugins = (
  configs: EdimFlatListMergePluginConfigs,
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

  return [...edimMergeAdjacentNodePlugins(mergeConfigs)];
};
