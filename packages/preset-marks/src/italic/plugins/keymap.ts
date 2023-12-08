import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpItalicKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpItalicKeymapPlugins = (
  configs: CreatePmpItalicKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-i': toggleMark(configs.markType),
      'Mod-I': toggleMark(configs.markType),
    }),
  ];
};
