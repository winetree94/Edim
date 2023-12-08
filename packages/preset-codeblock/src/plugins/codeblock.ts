import { NodeType } from 'prosemirror-model';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';
import { createCodeBlockInputRulePlugins } from './input-rules';
import { createCodeBlockKeymapPlugins } from './keymap';

export interface CreateCodeBlockPluginConfigs {
  nodeType: NodeType;
}

export const createCodeBlockPlugins = (
  configs: CreateCodeBlockPluginConfigs,
) => {
  return [
    ...createCodeBlockInputRulePlugins(configs),
    ...createCodeBlockKeymapPlugins(configs),
    ...createPmpMergeAdjacentNodePlugins({
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
