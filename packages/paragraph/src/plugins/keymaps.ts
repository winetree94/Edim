import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { mac } from '@edim-editor/core';

export interface EdimParagraphKeymapPluginConfigs {
  nodeType: NodeType;

  /**
   * default:
   *  - mac: 'Alt-Meta-º'
   *  - others: 'Ctrl-Alt-0'
   */
  shortcutKey?: string;
}

export const edimParagraphKeymapPlugins = (
  configs: EdimParagraphKeymapPluginConfigs,
) => {
  const key = configs.shortcutKey || (mac ? 'Alt-Meta-º' : 'Ctrl-Alt-0');
  return [
    keymap({
      [key]: setBlockType(configs.nodeType),
    }),
  ];
};
