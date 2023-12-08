import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpBlockquoteInputRulePlugins } from './input-rules';
import { createPmpBlockquoteKeymapPlugins } from './keymaps';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';

export interface CreateBlockQuotePluginConfigs {
  nodeType: NodeType;
  mergeAdjacentBlockquote?: boolean;
}

export const createPmpBlockQuotePlugins = (
  configs: CreateBlockQuotePluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    ...createPmpBlockquoteInputRulePlugins(configs),
    ...createPmpBlockquoteKeymapPlugins(configs),
  ];

  if (configs.mergeAdjacentBlockquote) {
    plugins.push(
      ...createPmpMergeAdjacentNodePlugins({
        specs: [
          {
            nodeType: configs.nodeType,
          },
        ],
      }),
    );
  }

  return plugins;
};
