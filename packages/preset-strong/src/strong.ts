import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';

const strongDOM: DOMOutputSpec = ['strong', 0];
const strong: Record<string, MarkSpec> = {
  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: 'b',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          return dom.style.fontWeight != 'normal' && null;
        },
      },
      { style: 'font-weight=400', clearMark: (m) => m.type.name == 'strong' },
      {
        style: 'font-weight',
        getAttrs: (node) => {
          const value = node as string;
          return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
        },
      },
    ],
    toDOM() {
      return strongDOM;
    },
  },
};

export const Strong = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...strong,
    },
    plugins: (schema) => [
      keymap({
        'Mod-b': toggleMark(schema.marks['strong']),
        'Mod-B': toggleMark(schema.marks['strong']),
      }),
    ],
  };
};
