import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface EdimBlockQuoteMergePluginConfigs {
  nodeType: NodeType;
}

export const edimBlockQuoteMergePlugins = (
  configs: EdimBlockQuoteMergePluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [];

  plugins.push(
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.nodeType,
        },
      ],
    }),
  );

  return plugins;
};
