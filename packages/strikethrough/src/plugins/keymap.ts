import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkStrikethroughMarkType } from '../utils';

export interface EdimStrikethroughKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimStrikethroughKeymapPlugins = (
  configs?: EdimStrikethroughKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-s': (state, dispatch) => {
        const markType = checkStrikethroughMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-Shift-S': (state, dispatch) => {
        const markType = checkStrikethroughMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
