import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpStrikethroughKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpStrikethroughKeymapPlugins = (
  configs: CreatePmpStrikethroughKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-s': toggleMark(configs.markType),
      'Mod-Shift-S': toggleMark(configs.markType),
    }),
  ];
};
