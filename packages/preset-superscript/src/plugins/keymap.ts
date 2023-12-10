import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpSuperscriptKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpSuperscriptKeymapPlugins = (
  configs: CreatePmpSuperscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-.': toggleMark(configs.markType),
      'Mod-Shift->': toggleMark(configs.markType),
    }),
  ];
};
