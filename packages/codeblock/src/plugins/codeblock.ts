import { NodeType } from 'prosemirror-model';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';
import { edimCodeBlockInputRulePlugins } from './input-rules';
import { edimCodeBlockKeymapPlugins } from './keymap';
import { checkCodeblockNodeType } from '../utils';

export interface EdimCodeBlockPluginConfigs {
  nodeType?: NodeType;
}

export const edimCodeBlockPlugins = (configs?: EdimCodeBlockPluginConfigs) => {
  return [
    ...edimCodeBlockInputRulePlugins(configs),
    ...edimCodeBlockKeymapPlugins(configs),
    ...edimMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: checkCodeblockNodeType(configs?.nodeType),
          beforeMergeTransaction: (tr, joinPos) =>
            tr.insertText('\n', joinPos, joinPos + 1),
        },
      ],
    }),
  ];
};
