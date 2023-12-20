import { MarkSpec } from 'prosemirror-model';

export const EDIM_ITALIC_MARK_NAME = 'em';

export interface EdimItalicMarkConfigs {
  markName?: string;
}

const DEFAULT_CONFIGS: Required<EdimItalicMarkConfigs> = {
  markName: EDIM_ITALIC_MARK_NAME,
};

export const edimItalicMarks = (
  configs?: EdimItalicMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' },
    ],
    toDOM() {
      return ['em', 0];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
