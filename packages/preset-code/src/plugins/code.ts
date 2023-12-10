import { MarkType } from 'prosemirror-model';
import { createPmpCodeKeymapPlugins } from './keymap';
import { createPmpCodeInputRulePlugins } from './input-rules';

export interface CreatePmpCodePluginConfigs {
  markType: MarkType;
}

export const createPmpCodePlugins = (configs: CreatePmpCodePluginConfigs) => {
  return [
    ...createPmpCodeKeymapPlugins(configs),
    ...createPmpCodeInputRulePlugins(configs),
  ];
};
