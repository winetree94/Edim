import { MarkType } from 'prosemirror-model';
import { createPmpCodeKeymapPlugins } from './keymap';

export interface CreatePmpCodePluginConfigs {
  markType: MarkType;
}

export const createPmpCodePlugins = (configs: CreatePmpCodePluginConfigs) => {
  return [...createPmpCodeKeymapPlugins(configs)];
};
