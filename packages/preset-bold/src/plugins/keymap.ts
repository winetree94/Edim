import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimBoldKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimBoldKeymapPlugins = (
  configs: CreateEdimBoldKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-b': toggleMark(configs.markType),
      'Mod-B': toggleMark(configs.markType),
    }),
  ];
};
