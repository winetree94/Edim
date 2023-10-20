import { keymap } from 'prosemirror-keymap';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { undoInputRule } from 'prosemirror-inputrules';
import {
  baseKeymap,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
} from 'prosemirror-commands';

export const BasicKeymap = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {},
    plugins: () => [
      keymap({
        Backspace: undoInputRule,
        'Alt-ArrowUp': joinUp,
        'Alt-ArrowDown': joinDown,
        'Mod-BracketLeft': lift,
        Escape: selectParentNode,
      }),
      keymap(baseKeymap),
    ],
  };
};
