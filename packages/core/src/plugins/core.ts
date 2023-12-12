import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimBasicKeymapPlugins } from './keymap';
import { edimHistoryPlugins } from './history';
import { edimVirtualCursorPlugins } from './virtual-cursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

export interface EdimCorePluginConfigs {}

export const edimCorePlugins = (
  configs?: EdimCorePluginConfigs,
): PMPlugin[] => {
  return [
    ...edimBasicKeymapPlugins(),
    ...edimHistoryPlugins(),
    ...edimVirtualCursorPlugins(),
    dropCursor(),
    gapCursor(),
  ];
};
