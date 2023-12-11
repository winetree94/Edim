import { MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

export interface CreateEdimBoldPluginConfigs {
  markType: MarkType;
}

export const createEdimBoldPlugins = (configs: CreateEdimBoldPluginConfigs) => {
  return [
    keymap({
      'Mod-b': toggleMark(configs.markType),
      'Mod-B': toggleMark(configs.markType),
    }),
  ];
};
