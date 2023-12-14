import { MarkType } from 'prosemirror-model';
import { edimSubscriptKeymapPlugins } from './keymap';

export interface EdimSubscriptPluginConfigs {
  markType: MarkType;
}

export const edimSubscriptPlugins = (configs: EdimSubscriptPluginConfigs) => {
  return [...edimSubscriptKeymapPlugins(configs)];
};
