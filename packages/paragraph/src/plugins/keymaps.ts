import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { mac } from '@edim-editor/core';

export interface EdimParagraphKeymapPluginConfigs {
  nodeType: NodeType;
}

export const edimParagraphKeymapPlugins = (
  configs: EdimParagraphKeymapPluginConfigs,
) => {
  const key = mac ? 'Alt-Meta-º' : 'Ctrl-Alt-0';
  return [
    keymap({
      [key]: setBlockType(configs.nodeType),
    }),
  ];
};
