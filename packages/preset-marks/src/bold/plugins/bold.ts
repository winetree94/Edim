import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreatePmpBoldPluginConfigs {
  markType: MarkType;
}

export const createPmpBoldPlugins = (configs: CreatePmpBoldPluginConfigs) => {
  return [
    keymap({
      'Mod-b': toggleMark(configs.markType),
      'Mod-B': toggleMark(configs.markType),
    }),
  ];
};
