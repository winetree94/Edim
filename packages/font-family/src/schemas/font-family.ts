import { MarkSpec, MarkType } from 'prosemirror-model';

export const EDIM_FONT_FAMILY_DEFAULT_MARK_NAME = 'font_family';

export interface EdimFontFamilyAttrs {
  fontFamily: string | null;
}

export interface EdimFontFamily {
  fontFamily: string;
}

export interface EdimFontFamilyMarkSpec extends MarkSpec {
  fonts: EdimFontFamily[];
}

export interface EdimFontFamilyMarkType extends MarkType {
  spec: EdimFontFamilyMarkSpec;
}

export interface EdimFontFamilyMarkConfigs {
  markName?: string;
  fonts?: EdimFontFamily[];
}

const DEFAULT_CONFIGS: Required<EdimFontFamilyMarkConfigs> = {
  markName: EDIM_FONT_FAMILY_DEFAULT_MARK_NAME,
  fonts: [
    {
      fontFamily: 'Arial',
    },
    {
      fontFamily: 'Verdana',
    },
    {
      fontFamily: 'Tahoma',
    },
    {
      fontFamily: 'Trebuchet MS',
    },
    {
      fontFamily: 'Times New Roman',
    },
    {
      fontFamily: 'Georgia',
    },
  ],
};

export const edimFontFamilyMarks = (
  configs?: EdimFontFamilyMarkConfigs,
): Record<string, EdimFontFamilyMarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const fontByNames = mergedConfigs.fonts.reduce<{
    [key: string]: EdimFontFamily;
  }>((acc, font) => {
    acc[font.fontFamily] = font;
    return acc;
  }, {});

  const markSpec: EdimFontFamilyMarkSpec = {
    fonts: mergedConfigs.fonts,
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
          const fontFamily = dom.dataset['fontFamily'] || '';

          if (!fontFamily) {
            return false;
          }

          if (mergedConfigs.fonts && !fontByNames[fontFamily]) {
            return false;
          }
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
          class: 'edim-font-family',
          style: attrs.fontFamily
            ? `font-family: ${attrs.fontFamily}`
            : undefined,
          'data-font-family': attrs.fontFamily || null,
        },
        0,
      ];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
