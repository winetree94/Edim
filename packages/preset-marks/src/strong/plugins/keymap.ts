import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpBoldKeymapPluginConfigs {
  markType: MarkType;
}

export const createPmpBoldKeymapPlugins = (
  configs: CreatePmpBoldKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-b': toggleMark(configs.markType),
      'Mod-B': toggleMark(configs.markType),
    }),
  ];
};
