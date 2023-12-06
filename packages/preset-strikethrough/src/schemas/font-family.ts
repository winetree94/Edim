import { MarkSpec, MarkType } from 'prosemirror-model';

export interface PmpFontFamilyAttrs {
  fontFamily: string | null;
}

export interface PmpFontFamily {
  fontFamily: string;
  label: string;
}

export interface PmpFontFamilyMarkSpec extends MarkSpec {
  fonts: PmpFontFamily[];
}

export interface PmpFontFamilyMarkType extends MarkType {
  spec: PmpFontFamilyMarkSpec;
}

export const PMP_FONT_FAMILY_MARK: Record<string, PmpFontFamilyMarkSpec> = {
  font_family: {
    fonts: [
      {
        fontFamily: 'Noto Sans KR',
        label: 'Noto Sans KR',
      },
      {
        fontFamily: 'Nanum Gothic',
        label: 'Nanum Gothic',
      },
      {
        fontFamily: 'Dhurjati',
        label: 'Dhurjati',
      },
    ],
    attrs: {
      fontFamily: {
        default: null,
      },
    },
    parseDOM: [
      {
        tag: 'span.pmp-font-family',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const fontFamily = dom.getAttribute('data-font-family');
          return {
            fontFamily: fontFamily || null,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as PmpFontFamilyAttrs;
      return [
        'span',
        {
          class: 'font-family',
          style: attrs.fontFamily
            ? `font-family: ${attrs.fontFamily}`
            : undefined,
          'data-font-family': attrs.fontFamily || null,
        },
        0,
      ];
    },
  },
};
