import { NodeType } from 'prosemirror-model';
import { edimHorizontalKeymapPlugins } from './keymap';

export interface EdimHorizontalRulePluginConfigs {
  nodeType: NodeType;
}

export const edimHorizontalRulePlugins = (
  configs: EdimHorizontalRulePluginConfigs,
) => {
  return [...edimHorizontalKeymapPlugins(configs)];
};
