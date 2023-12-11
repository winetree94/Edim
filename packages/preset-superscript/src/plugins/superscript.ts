import { MarkType } from 'prosemirror-model';
import { createEdimSuperscriptKeymapPlugins } from './keymap';

export interface CreateEdimSuperscriptPluginConfigs {
  markType: MarkType;
}

export const createEdimSuperscriptPlugins = (
  configs: CreateEdimSuperscriptPluginConfigs,
) => {
  return [...createEdimSuperscriptKeymapPlugins(configs)];
};
