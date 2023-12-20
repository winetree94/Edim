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
}

const DEFAULT_CONFIGS: Required<EdimTextColorMarkConfigs> = {
  markName: EDIM_TEXT_COLOR_DEFAULT_MARK_NAME,
};

export const edimTextColorMarks = (
  configs?: EdimTextColorMarkConfigs,
): Record<string, EdimTextColorMarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: EdimTextColorMarkSpec = {
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
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
