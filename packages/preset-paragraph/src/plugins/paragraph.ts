import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ParagraphAttributes } from '../schemas';
import { Plugin as PmPlugin } from 'prosemirror-state';
import { createEdimParagraphKeymapPlugins } from './keymaps'; 

export interface EdimParagraphPluginConfigs {
  nodeType: NodeType;
}

export const createEdimParagraphPlugins = (
  configs: EdimParagraphPluginConfigs,
): PmPlugin[] => {
  return [
    ...createEdimParagraphKeymapPlugins(configs)
  ];
};
