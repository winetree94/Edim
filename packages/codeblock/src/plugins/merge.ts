import { NodeType } from 'prosemirror-model';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface EdimCodeBlockMergePluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockMergePlugins = (configs: EdimCodeBlockMergePluginConfigs) => {
  return [
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.nodeType,
          beforeMergeTransaction: (tr, joinPos) =>
            tr.insertText('\n', joinPos, joinPos + 1),
        },
      ],
    }),
  ];
};
