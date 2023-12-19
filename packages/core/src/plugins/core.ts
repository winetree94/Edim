import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBasicKeymapPlugins } from './keymap';
import { edimHistoryPlugins } from './history';
import { edimVirtualCursorPlugins } from './virtual-cursor';
import { edimDropCursorPlugins } from './drop-cursor';
import { edimGapCursorPlugins } from './gap-cursor';

export const edimCorePlugins = (): PMPlugin[] => {
  return [
    ...edimBasicKeymapPlugins(),
    ...edimHistoryPlugins(),
    ...edimVirtualCursorPlugins(),
    ...edimDropCursorPlugins(),
    ...edimGapCursorPlugins(),
  ];
};
