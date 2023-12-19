import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBlockquoteInputRulePlugins } from './input-rules';
import { edimBlockquoteKeymapPlugins } from './keymaps';
import { edimBlockQuoteMergePlugins } from './merge';

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
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const plugins: PMPlugin[] = [
    ...edimBlockquoteKeymapPlugins(mergedConfigs),
    ...edimBlockquoteInputRulePlugins(mergedConfigs),
  ];

  if (mergedConfigs.mergeAdjacentBlockquote) {
    plugins.push(
      ...edimBlockQuoteMergePlugins({
        nodeType: mergedConfigs.nodeType,
      }),
    );
  }

  return plugins;
};
