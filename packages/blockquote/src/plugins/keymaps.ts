import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { checkBlockquoteNodeType } from '../utils';

export interface EdimBlockquoteKeymapPluginConfigs {
  nodeType?: NodeType;
}

export const edimBlockquoteKeymapPlugins = (
  configs?: EdimBlockquoteKeymapPluginConfigs,
): PMPlugin[] => [
  keymap({
    'Ctrl->': (state, dispatch) => {
      const nodeType = checkBlockquoteNodeType(configs?.nodeType)(state);
      return wrapIn(nodeType)(state, dispatch);
    },
  }),
];
