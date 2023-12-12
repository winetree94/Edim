import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkSubscriptMarkType } from '../utils';

export interface EdimSubscriptKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimSubscriptKeymapPlugins = (
  configs?: EdimSubscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-,': (state, dispatch) => {
        const markType = checkSubscriptMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-Shift-<': (state, dispatch) => {
        const markType = checkSubscriptMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
