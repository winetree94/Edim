import { keymap } from 'prosemirror-keymap';
import { undoInputRule } from 'prosemirror-inputrules';
import {
  baseKeymap,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
} from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';

export interface CreatePmpBasicKeymapPluginConfigs {}

export const createPmpBasicKeymapPlugins = (
  configs: CreatePmpBasicKeymapPluginConfigs,
): Plugin[] => {
  return [
    keymap({
      Backspace: undoInputRule,
      'Alt-ArrowUp': joinUp,
      'Alt-ArrowDown': joinDown,
      'Mod-BracketLeft': lift,
      Escape: selectParentNode,
    }),
    keymap(baseKeymap),
  ];
};