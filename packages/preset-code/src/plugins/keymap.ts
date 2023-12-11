import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimCodeKeymapPluginConfigs {
  markType: MarkType;
}

export const createEdimCodeKeymapPlugins = (
  configs: CreateEdimCodeKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-M': toggleMark(configs.markType),
    }),
  ];
};
