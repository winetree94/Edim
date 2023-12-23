import { NodeType } from 'prosemirror-model';
import { edimCodeBlockInputRulePlugins } from './input-rules';
import { edimCodeBlockKeymapPlugins } from './keymap';
import { edimCodeBlockMergePlugins } from './merge';
import { edimCodeBlockEjectPlugins } from './eject';

export interface EdimCodeBlockPluginConfigs {
  nodeType: NodeType;
  mergeAdjacentCodeBlock?: boolean;
}

const DEFAULT_CONFIGS: Required<Omit<EdimCodeBlockPluginConfigs, 'nodeType'>> =
  {
    mergeAdjacentCodeBlock: true,
  };

export const edimCodeBlockPlugins = (configs: EdimCodeBlockPluginConfigs) => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const plugins = [
    ...edimCodeBlockKeymapPlugins(mergedConfigs),
    ...edimCodeBlockInputRulePlugins(mergedConfigs),
    ...edimCodeBlockEjectPlugins(mergedConfigs),
  ];

  if (mergedConfigs.mergeAdjacentCodeBlock) {
    plugins.push(
      ...edimCodeBlockMergePlugins({
        nodeType: mergedConfigs.nodeType,
      }),
    );
  }

  return plugins;
};
