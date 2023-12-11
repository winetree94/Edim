import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';

export interface EdimCodeBlockKeymapPluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockKeymapPlugins = (
  configs: EdimCodeBlockKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Shift-Ctrl-\\': setBlockType(configs.nodeType),
    }),
  ];
};
