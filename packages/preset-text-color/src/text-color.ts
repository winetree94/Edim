import { MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

export interface TextColorAttributes {
  color: string;
}

export const PMP_TEXT_COLOR_MARK: Record<string, MarkSpec> = {
  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  textColor: {
    attrs: {
      color: { default: '' },
    },
    parseDOM: [{ tag: 'span.pmp-text-color' }],
    toDOM(node) {
      const attrs = node.attrs as TextColorAttributes;
      return [
        'span',
        {
          class: 'pmp-text-color',
          style: `color: ${attrs.color};`,
          attrs: {
            style: `color: ${attrs.color}`,
          },
        },
        0,
      ];
    },
  },
};

export const TextColor = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...PMP_TEXT_COLOR_MARK,
    },
    plugins: (schema) => [],
  };
};
