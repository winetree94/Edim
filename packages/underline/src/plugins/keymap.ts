import { Plugin as PMPlugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';
import { checkUnderlineMarkType } from '../utils';

export interface EdimUnderlineKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimUnderlineKeymapPlugins = (
  configs?: EdimUnderlineKeymapPluginConfigs,
): PMPlugin[] => {
  return [
    keymap({
      'Mod-u': (state, dispatch) => {
        const markType = checkUnderlineMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-U': (state, dispatch) => {
        const markType = checkUnderlineMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
