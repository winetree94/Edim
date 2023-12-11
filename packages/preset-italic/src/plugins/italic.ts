import { MarkType } from 'prosemirror-model';
import { createEdimItalicKeymapPlugins } from './keymap';

export interface CreateEdimItalicPluginConfigs {
  markType: MarkType;
}

export const createEdimItalicPlugins = (
  configs: CreateEdimItalicPluginConfigs,
) => {
  return [...createEdimItalicKeymapPlugins(configs)];
};
