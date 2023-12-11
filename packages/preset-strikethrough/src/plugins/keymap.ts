import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimStrikethroughKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimStrikethroughKeymapPlugins = (
  configs: CreateEdimStrikethroughKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-s': toggleMark(configs.markType),
      'Mod-Shift-S': toggleMark(configs.markType),
    }),
  ];
};
