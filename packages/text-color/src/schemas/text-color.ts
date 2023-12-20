import { MarkSpec, MarkType } from 'prosemirror-model';

export const EDIM_TEXT_COLOR_DEFAULT_MARK_NAME = 'text_color';

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

export interface EdimTextColorMarkConfigs {
  markName?: string;
  colors?: EdimTextColor[];
}

const DEFAULT_CONFIGS: Required<EdimTextColorMarkConfigs> = {
  markName: EDIM_TEXT_COLOR_DEFAULT_MARK_NAME,
  colors: [
    '#182B4D',
    '#0055CC',
    '#206A83',
    '#216E4E',
    '#E56910',
    '#AE2E24',
    '#5E4DB2',
    '#758195',
    '#1D7AFC',
    '#2898BD',
    '#22A06B',
    '#FEA362',
    '#C9372C',
    '#8270DB',
  ].map((color) => ({ color })),
};

export const edimTextColorMarks = (
  configs?: EdimTextColorMarkConfigs,
): Record<string, EdimTextColorMarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: EdimTextColorMarkSpec = {
    colors: mergedConfigs.colors,
    attrs: {
      color: { default: '' },
    },
    parseDOM: [
      {
        tag: 'span.edim-text-color',
        getAttrs: (node) => {
          const dom = node as HTMLSpanElement;
          const color = dom.dataset['color'];
          if (!color) {
            return false;
          }
          if (
            mergedConfigs.colors &&
            !mergedConfigs.colors.find((c) => c.color === color)
          ) {
            return false;
          }
          return { color };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as EdimTextColorAttrs;
      return [
        'span',
        {
          class: 'edim-text-color',
          style: `color: ${attrs.color};`,
          'data-color': attrs.color,
        },
        0,
      ];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
