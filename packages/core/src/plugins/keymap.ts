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
import { clearMarks } from '../commands';

export interface EdimBasicKeymapPluginConfigs {}

export const edimBasicKeymapPlugins = (
  configs?: EdimBasicKeymapPluginConfigs,
): Plugin[] => {
  return [
    keymap({
      Backspace: undoInputRule,
      'Alt-ArrowUp': joinUp,
      'Alt-ArrowDown': joinDown,
      'Mod-BracketLeft': lift,
      Escape: selectParentNode,
      'Mod-\\': clearMarks(),
    }),
    keymap(baseKeymap),
  ];
};
