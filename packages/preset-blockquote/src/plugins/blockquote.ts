import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpBlockquoteInputRulePlugins } from './input-rules';
import { createPmpBlockquoteKeymapPlugins } from './keymaps';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';

export interface CreateBlockQuotePluginConfigs {
  nodeType: NodeType;
}

export const createPmpBlockquotePlugins = (
  configs: CreateBlockQuotePluginConfigs,
): PMPlugin[] => {
  return [
    ...createPmpBlockquoteInputRulePlugins(configs),
    ...createPmpBlockquoteKeymapPlugins(configs),
    ...createPmpMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.nodeType,
        },
      ],
    }),
  ];
};
