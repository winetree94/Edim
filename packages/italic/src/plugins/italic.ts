import { MarkType } from 'prosemirror-model';
import { edimItalicKeymapPlugins } from './keymap';

export interface EdimItalicPluginConfigs {
  markType: MarkType;
}

export const edimItalicPlugins = (configs: EdimItalicPluginConfigs) => {
  return [...edimItalicKeymapPlugins(configs)];
};
