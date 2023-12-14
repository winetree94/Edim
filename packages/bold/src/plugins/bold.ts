import { MarkType } from 'prosemirror-model';
import { edimBoldKeymapPlugins } from './keymap';

export interface EdimBoldPluginConfigs {
  markType: MarkType;
}

export const edimBoldPlugins = (configs: EdimBoldPluginConfigs) => {
  return [...edimBoldKeymapPlugins(configs)];
};
