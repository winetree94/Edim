import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkItalicMarkType } from '../utils';

export interface EdimItalicKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimItalicKeymapPlugins = (
  configs?: EdimItalicKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-i': (state, dispatch) => {
        const markType = checkItalicMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-I': (state, dispatch) => {
        const markType = checkItalicMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
