import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

export interface PmpBlockquoteKeymapPluginConfigs {
  nodeType: NodeType;
}

export const createPmpBlockquoteKeymapPlugins = (
  configs: PmpBlockquoteKeymapPluginConfigs,
): PMPlugin[] => [
  keymap({
    'Ctrl->': wrapIn(configs.nodeType),
  }),
];
