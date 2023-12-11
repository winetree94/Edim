import { NodeType } from 'prosemirror-model';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { createEdimBlockquoteInputRulePlugins } from './input-rules';
import { createEdimBlockquoteKeymapPlugins } from './keymaps';
import { createEdimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface CreateBlockQuotePluginConfigs {
  nodeType: NodeType;
  mergeAdjacentBlockquote?: boolean;
}

export const createEdimBlockQuotePlugins = (
  configs: CreateBlockQuotePluginConfigs,
): EDIMlugin[] => {
  const plugins: EDIMlugin[] = [
    ...createEdimBlockquoteInputRulePlugins(configs),
    ...createEdimBlockquoteKeymapPlugins(configs),
  ];

  if (configs.mergeAdjacentBlockquote) {
    plugins.push(
      ...createEdimMergeAdjacentNodePlugins({
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
