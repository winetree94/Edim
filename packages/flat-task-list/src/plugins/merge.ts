import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface EdimFlatTaskListMergePluginConfigs {
  taskListNodeType: NodeType;
}

export const edimFlatTaskListMergePlugins = (
  configs: EdimFlatTaskListMergePluginConfigs,
): PMPlugin[] => {
  return [
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.taskListNodeType,
        },
      ],
    }),
  ];
};
