import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { checkCodeblockNodeType } from '../utils';

export interface EdimCodeBlockKeymapPluginConfigs {
  nodeType?: NodeType;
}

export const edimCodeBlockKeymapPlugins = (
  configs?: EdimCodeBlockKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Shift-Ctrl-\\': (state, dispatch) => {
        const nodeType = checkCodeblockNodeType(configs?.nodeType)(state);
        return setBlockType(nodeType)(state, dispatch);
      },
    }),
  ];
};
