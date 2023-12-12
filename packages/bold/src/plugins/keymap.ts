import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkBoldMarkType } from '../utils';

export interface EdimBoldKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimBoldKeymapPlugins = (
  configs?: EdimBoldKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-b': (state, dispatch) => {
        const markType = checkBoldMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-B': (state, dispatch) => {
        const markType = checkBoldMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
