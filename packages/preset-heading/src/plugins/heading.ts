import { createPmpHeadingInputRulePlugins } from './input-rules';
import { createPmpHeadingKeymapPlugins } from './keymaps';
import { NodeType } from 'prosemirror-model';

export interface PmpHeadingPluginConfigs {
  nodeType: NodeType;
  level: number;
}

export const createPmpHeadingPlugins = (configs: PmpHeadingPluginConfigs) => {
  return [
    ...createPmpHeadingInputRulePlugins(configs),
    ...createPmpHeadingKeymapPlugins(configs),
  ];
};
