import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBlockquoteInputRulePlugins } from './input-rules';
import { edimBlockquoteKeymapPlugins } from './keymaps';
import { edimMergeAdjacentNodePlugins } from '@edim-editor/core';

export interface EdimBlockQuotePluginConfigs {
  nodeType: NodeType;
  mergeAdjacentBlockquote?: boolean;
}

const DEFAULT_CONFIGS: Required<Omit<EdimBlockQuotePluginConfigs, 'nodeType'>> =
  {
    mergeAdjacentBlockquote: false,
  };

export const edimBlockQuotePlugins = (
  configs: EdimBlockQuotePluginConfigs,
): PMPlugin[] => {
  const _configs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const plugins: PMPlugin[] = [
    ...edimBlockquoteInputRulePlugins(_configs),
    ...edimBlockquoteKeymapPlugins(_configs),
  ];

  if (_configs.mergeAdjacentBlockquote) {
    plugins.push(
      ...edimMergeAdjacentNodePlugins({
        specs: [
          {
            nodeType: _configs.nodeType,
          },
        ],
      }),
    );
  }

  return plugins;
};
