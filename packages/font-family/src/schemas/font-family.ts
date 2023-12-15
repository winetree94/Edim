import { MarkSpec, MarkType } from 'prosemirror-model';

export const EDIM_FONT_FAMILY_DEFAULT_MARK_NAME = 'font_family';

export interface EdimFontFamilyAttrs {
  fontFamily: string | null;
}

export interface EdimFontFamily {
  fontFamily: string;
  label: string;
}

export interface EdimFontFamilyMarkSpec extends MarkSpec {
  fonts: EdimFontFamily[];
}

export interface EdimFontFamilyMarkType extends MarkType {
  spec: EdimFontFamilyMarkSpec;
}

export const edimFontFamilyMarks = (): Record<
  string,
  EdimFontFamilyMarkSpec
> => ({
  [EDIM_FONT_FAMILY_DEFAULT_MARK_NAME]: {
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
        tag: 'span.edim-font-family',
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
      const attrs = node.attrs as EdimFontFamilyAttrs;
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
});
