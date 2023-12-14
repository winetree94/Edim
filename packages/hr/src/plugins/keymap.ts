import { keymap } from 'prosemirror-keymap';
import { NodeType } from 'prosemirror-model';

export interface EdimHorizontalKeymapPluginConfigs {
  nodeType: NodeType;
}

export const edimHorizontalKeymapPlugins = (
  configs: EdimHorizontalKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Mod-_': (state, dispatch) => {
        if (dispatch) {
          dispatch(
            state.tr
              .replaceSelectionWith(configs.nodeType.create())
              .scrollIntoView(),
          );
        }
        return true;
      },
    }),
  ];
};
