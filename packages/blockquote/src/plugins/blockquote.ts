import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBlockquoteInputRulePlugins } from './input-rules';
import { edimBlockquoteKeymapPlugins } from './keymaps';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface EdimBlockQuotePluginConfigs {
  nodeType: NodeType;
  mergeAdjacentBlockquote?: boolean;
}

export const edimBlockQuotePlugins = (
  configs: EdimBlockQuotePluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    ...edimBlockquoteInputRulePlugins(configs),
    ...edimBlockquoteKeymapPlugins(configs),
  ];

  if (configs?.mergeAdjacentBlockquote) {
    plugins.push(
      ...edimMergeAdjacentNodePlugins({
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
