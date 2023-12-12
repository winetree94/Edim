import { MarkSpec, MarkType } from 'prosemirror-model';

export interface EdimTextColorAttrs {
  color: string;
}

export interface EdimTextColor {
  color: string;
}

export interface EdimTextColorMarkSpec extends MarkSpec {
  colors: EdimTextColor[];
}

export interface EdimTextColorMarkType extends MarkType {
  spec: EdimTextColorMarkSpec;
}

export const edimTextColorMarks = (): Record<string, EdimTextColorMarkSpec> => ({
  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  text_color: {
    colors: [],
    attrs: {
      color: { default: '' },
    },
    parseDOM: [{ tag: 'span.edim-text-color' }],
    toDOM(node) {
      const attrs = node.attrs as EdimTextColorAttrs;
      return [
        'span',
        {
          class: 'edim-text-color',
          style: `color: ${attrs.color};`,
          attrs: {
            style: `color: ${attrs.color}`,
          },
        },
        0,
      ];
    },
  },
});
