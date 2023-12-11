import { Plugin as EDIMlugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

export interface EdimUnderlineKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimUnderlineKeymapPlugins = (
  configs: EdimUnderlineKeymapPluginConfigs,
): EDIMlugin[] => {
  return [
    keymap({
      'Mod-u': toggleMark(configs.markType),
      'Mod-U': toggleMark(configs.markType),
    }),
  ];
};
