import { MarkSpec } from 'prosemirror-model';

export const EDIM_UNDERLINE_MARK_NAME = 'underline';

export interface EdimUnderlineMarkConfigs {
  markName?: string;
}

const DEFAULT_CONFIGS: Required<EdimUnderlineMarkConfigs> = {
  markName: EDIM_UNDERLINE_MARK_NAME,
};

export const edimUnderlineMarks = (
  configs?: EdimUnderlineMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    parseDOM: [{ tag: 'u' }],
    toDOM() {
      return ['u', 0];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
