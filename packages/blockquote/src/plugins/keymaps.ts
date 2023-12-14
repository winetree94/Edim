import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

export interface EdimBlockquoteKeymapPluginConfigs {
  nodeType: NodeType;
}

export const edimBlockquoteKeymapPlugins = (
  configs: EdimBlockquoteKeymapPluginConfigs,
): PMPlugin[] => [
  keymap({
    'Ctrl->': wrapIn(configs.nodeType),
  }),
];
