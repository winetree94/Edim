import { Plugin as PmPlugin } from 'prosemirror-state';
import { createEdimBasicKeymapPlugins } from './keymap';
import { createEdimHistoryPlugins } from './history';
import { createEdimVirtualCursorPlugins } from './virtual-cursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

export const createEdimCorePlugins = (): PmPlugin[] => {
  return [
    ...createEdimBasicKeymapPlugins({}),
    ...createEdimHistoryPlugins({}),
    ...createEdimVirtualCursorPlugins(),
    dropCursor(),
    gapCursor(),
  ];
};
