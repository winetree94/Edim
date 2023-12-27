import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBasicKeymapPlugins } from './keymap';
import { edimHistoryPlugins } from './history';
import { edimVirtualCursorPlugins } from './virtual-cursor';
import { edimDropCursorPlugins } from './drop-cursor';
import { edimGapCursorPlugins } from './gap-cursor';
import { edimResetMarkPlugins } from './reset-mark';
import { edimOverlayPlugins } from './overlay';
import { edimSelectionElementPlugins } from './selection-element';

export const edimCorePlugins = (): PMPlugin[] => {
  return [
    ...edimOverlayPlugins(),
    ...edimBasicKeymapPlugins(),
    ...edimHistoryPlugins(),
    ...edimVirtualCursorPlugins(),
    ...edimResetMarkPlugins(),
    ...edimDropCursorPlugins(),
    ...edimSelectionElementPlugins(),
    ...edimGapCursorPlugins(),
  ];
};
