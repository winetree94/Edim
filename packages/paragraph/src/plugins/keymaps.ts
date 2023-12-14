import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { mac } from '@edim-editor/core';

export interface EdimParagraphKeymapPluginConfigs {
  nodeType?: NodeType;
}

export const edimParagraphKeymapPlugins = (
  configs?: EdimParagraphKeymapPluginConfigs,
) => {
  const key = mac ? 'Alt-Meta-º' : 'Ctrl-Alt-0';
  return [
    keymap({
      [key]: (state, dispatch) => {
        const nodeType = configs?.nodeType || state.schema.nodes['paragraph'];
        if (!nodeType) {
          throw new Error('"paragraph" node type not found.');
        }
        return setBlockType(nodeType)(state, dispatch);
      },
    }),
  ];
};
