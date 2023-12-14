import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimBoldKeymapPluginConfigs {
  markType: MarkType;
}

export const edimBoldKeymapPlugins = (configs: EdimBoldKeymapPluginConfigs) => {
  return [
    keymap({
      'Mod-b': toggleMark(configs.markType),
      'Mod-B': toggleMark(configs.markType),
    }),
  ];
};
