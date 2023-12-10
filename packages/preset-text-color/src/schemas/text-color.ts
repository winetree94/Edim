import { MarkSpec, MarkType } from 'prosemirror-model';

export interface PmpTextColorAttrs {
  color: string;
}

export interface PmpTextColor {
  color: string;
}

export interface PmpTextColorMarkSpec extends MarkSpec {
  colors: PmpTextColor[];
}

export interface PmpTextColorMarkType extends MarkType {
  spec: PmpTextColorMarkSpec;
}

export const PMP_TEXT_COLOR_MARK: Record<string, PmpTextColorMarkSpec> = {
  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  text_color: {
    colors: [],
    attrs: {
      color: { default: '' },
    },
    parseDOM: [{ tag: 'span.pmp-text-color' }],
    toDOM(node) {
      const attrs = node.attrs as PmpTextColorAttrs;
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
