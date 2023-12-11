import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimItalicKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimItalicKeymapPlugins = (
  configs: CreateEdimItalicKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-i': toggleMark(configs.markType),
      'Mod-I': toggleMark(configs.markType),
    }),
  ];
};
