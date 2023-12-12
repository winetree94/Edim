import { keymap } from 'prosemirror-keymap';
import { NodeType } from 'prosemirror-model';
import { checkHorizontalNodeType } from '../utils';

export interface EdimHorizontalKeymapPluginConfigs {
  nodeType?: NodeType;
}

export const edimHorizontalKeymapPlugins = (
  configs?: EdimHorizontalKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-_': (state, dispatch) => {
        const nodeType = checkHorizontalNodeType(configs?.nodeType)(state);
        if (dispatch) {
          dispatch(
            state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView(),
          );
        }
        return true;
      },
    }),
  ];
};
