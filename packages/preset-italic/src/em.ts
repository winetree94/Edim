import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { emDash, inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

const emDOM: DOMOutputSpec = ['em', 0];
const em: Record<string, MarkSpec> = {
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

export const Italic = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...em,
    },
    plugins: (schema) => [
      inputRules({
        rules: [emDash],
      }),
      keymap({
        'Mod-i': toggleMark(schema.marks['em']),
        'Mod-I': toggleMark(schema.marks['em']),
      }),
    ],
  };
};
