import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkCodeMarkType } from '../utils';

export interface EdimCodeKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimCodeKeymapPlugins = (
  configs?: EdimCodeKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-M': (state, dispatch) => {
        const markType = checkCodeMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
