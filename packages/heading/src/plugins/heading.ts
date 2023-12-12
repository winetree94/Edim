import { edimHeadingInputRulePlugins } from './input-rules';
import { edimHeadingKeymapPlugins } from './keymaps';
import { NodeType } from 'prosemirror-model';

export interface EdimHeadingPluginConfigs {
  nodeType?: NodeType;
  level?: number;
}

export const edimHeadingPlugins = (configs?: EdimHeadingPluginConfigs) => {
  return [
    ...edimHeadingInputRulePlugins(configs),
    ...edimHeadingKeymapPlugins(configs),
  ];
};
