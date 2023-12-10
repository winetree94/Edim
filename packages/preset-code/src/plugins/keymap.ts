import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpCodeKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpCodeKeymapPlugins = (
  configs: CreatePmpCodeKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-M': toggleMark(configs.markType),
    }),
  ];
};
