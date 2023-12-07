import { DOMOutputSpec, MarkSpec, MarkType } from 'prosemirror-model';
import { emDash, inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

const emDOM: DOMOutputSpec = ['em', 0];
export const PMP_ITALIC_MARK: Record<string, MarkSpec> = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' },
    ],
    toDOM() {
      return emDOM;
    },
  },
};

export interface CreatePmpItalicPluginConfigs {
  markType: MarkType;
}

export const createPmpItalicPlugins = (
  configs: CreatePmpItalicPluginConfigs,
) => {
  return [
    inputRules({
      rules: [emDash],
    }),
    keymap({
      'Mod-i': toggleMark(configs.markType),
      'Mod-I': toggleMark(configs.markType),
    }),
  ];
};
