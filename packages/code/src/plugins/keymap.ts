import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface EdimCodeKeymapPluginConfigs {
  markType: MarkType;
}

export const edimCodeKeymapPlugins = (configs: EdimCodeKeymapPluginConfigs) => {
  return [
    keymap({
      'Mod-Shift-M': toggleMark(configs.markType),
    }),
  ];
};
