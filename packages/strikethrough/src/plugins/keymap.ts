import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimStrikethroughKeymapPluginConfigs {
  markType: MarkType;
}

export const edimStrikethroughKeymapPlugins = (
  configs: EdimStrikethroughKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-s': toggleMark(configs.markType),
      'Mod-Shift-S': toggleMark(configs.markType),
    }),
  ];
};
