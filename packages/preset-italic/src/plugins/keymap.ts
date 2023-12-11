import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimItalicKeymapPluginConfigs {
  markType: MarkType;
}

export const edimItalicKeymapPlugins = (
  configs: EdimItalicKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-i': toggleMark(configs.markType),
      'Mod-I': toggleMark(configs.markType),
    }),
  ];
};
