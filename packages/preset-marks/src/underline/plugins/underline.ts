import { MarkType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createPmpUnderlineKeymapPlugins } from './keymap';

export interface PmpUnderlinePluginConfigs {
  markType: MarkType;
}

export const createPmpUnderlinePlugins = (
  configs: PmpUnderlinePluginConfigs,
): PMPlugin[] => {
  return [...createPmpUnderlineKeymapPlugins(configs)];
};
