import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimSubscriptKeymapPluginConfigs {
  markType: MarkType;
}

export const edimSubscriptKeymapPlugins = (
  configs: EdimSubscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-,': toggleMark(configs.markType),
      'Mod-Shift-<': toggleMark(configs.markType),
    }),
  ];
};
