import { Plugin as PMPlugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

export interface PmpUnderlineKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpUnderlineKeymapPlugins = (
  configs: PmpUnderlineKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      'Mod-u': toggleMark(configs.markType),
      'Mod-U': toggleMark(configs.markType),
    }),
  ];
};
