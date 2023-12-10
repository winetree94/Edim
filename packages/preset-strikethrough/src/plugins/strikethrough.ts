import { MarkType } from 'prosemirror-model';
import { createPmpStrikethroughKeymapPlugins } from './keymap';

export interface CreatePmpStrikethroughPluginConfigs {
  markType: MarkType;
}

export const createPmpStrikethroughPlugins = (
  configs: CreatePmpStrikethroughPluginConfigs,
) => {
  return [...createPmpStrikethroughKeymapPlugins(configs)];
};
