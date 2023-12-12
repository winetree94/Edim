import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { checkSuperscriptMarkType } from '../utils';

export interface EdimSuperscriptKeymapPluginConfigs {
  markType?: MarkType;
}

export const edimSuperscriptKeymapPlugins = (
  configs?: EdimSuperscriptKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-Shift-.': (state, dispatch) => {
        const markType = checkSuperscriptMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
      'Mod-Shift->': (state, dispatch) => {
        const markType = checkSuperscriptMarkType(configs?.markType)(state);
        return toggleMark(markType)(state, dispatch);
      },
    }),
  ];
};
