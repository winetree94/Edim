import { DOMOutputSpec, MarkSpec, MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

const codeDOM: DOMOutputSpec = ['code', { class: 'pmp-code' }, 0];
export const PMP_CODE_MARK: Record<string, MarkSpec> = {
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
};

export interface CreatePmpCodePluginConfigs {
  markType: MarkType;
}

export const createPmpCodePlugins = (configs: CreatePmpCodePluginConfigs) => {
  return [
    keymap({
      'Mod-C': toggleMark(configs.markType),
    }),
  ];
};
