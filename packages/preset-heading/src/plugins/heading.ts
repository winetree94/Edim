import { createEdimHeadingInputRulePlugins } from './input-rules';
import { createEdimHeadingKeymapPlugins } from './keymaps';
import { NodeType } from 'prosemirror-model';

export interface EdimHeadingPluginConfigs {
  nodeType: NodeType;
  level: number;
}

export const createEdimHeadingPlugins = (configs: EdimHeadingPluginConfigs) => {
  return [
    ...createEdimHeadingInputRulePlugins(configs),
    ...createEdimHeadingKeymapPlugins(configs),
  ];
};
