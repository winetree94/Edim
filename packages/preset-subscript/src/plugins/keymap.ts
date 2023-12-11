import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimSubscriptKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimSubscriptKeymapPlugins = (
  configs: CreateEdimSubscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-,': toggleMark(configs.markType),
      'Mod-Shift-<': toggleMark(configs.markType),
    }),
  ];
};
