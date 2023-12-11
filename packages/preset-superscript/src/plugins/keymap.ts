import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimSuperscriptKeymapPluginConfigs {
  markType: MarkType;
}

export const edimSuperscriptKeymapPlugins = (
  configs: EdimSuperscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-.': toggleMark(configs.markType),
      'Mod-Shift->': toggleMark(configs.markType),
    }),
  ];
};
