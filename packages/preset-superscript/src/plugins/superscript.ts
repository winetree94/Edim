import { MarkType } from 'prosemirror-model';
import { createPmpSuperscriptKeymapPlugins } from './keymap';

export interface CreatePmpSuperscriptPluginConfigs {
  markType: MarkType;
}

export const createPmpSuperscriptPlugins = (
  configs: CreatePmpSuperscriptPluginConfigs,
) => {
  return [...createPmpSuperscriptKeymapPlugins(configs)];
};
