import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpSubscriptKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpSubscriptKeymapPlugins = (
  configs: CreatePmpSubscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-,': toggleMark(configs.markType),
      'Mod-Shift-<': toggleMark(configs.markType),
    }),
  ];
};
