import { Plugin as EDIMlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

export interface EdimBlockquoteKeymapPluginConfigs {
  nodeType: NodeType;
}

export const createEdimBlockquoteKeymapPlugins = (
  configs: EdimBlockquoteKeymapPluginConfigs,
): EDIMlugin[] => [
  keymap({
    'Ctrl->': wrapIn(configs.nodeType),
  }),
];
