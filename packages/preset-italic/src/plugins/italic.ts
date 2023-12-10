import { MarkType } from 'prosemirror-model';
import { createPmpItalicKeymapPlugins } from './keymap';

export interface CreatePmpItalicPluginConfigs {
  markType: MarkType;
}

export const createPmpItalicPlugins = (
  configs: CreatePmpItalicPluginConfigs,
) => {
  return [...createPmpItalicKeymapPlugins(configs)];
};
