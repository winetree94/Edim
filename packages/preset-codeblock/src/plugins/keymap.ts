import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';

export interface PmpCodeBlockKeymapPluginConfigs {
  nodeType: NodeType;
}

export const createCodeBlockKeymapPlugins = (
  configs: PmpCodeBlockKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Shift-Ctrl-\\': setBlockType(configs.nodeType),
    }),
  ];
};
