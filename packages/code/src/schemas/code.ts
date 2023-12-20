import { MarkSpec } from 'prosemirror-model';

export const EDIM_CODE_MARK_NAME = 'code';

export interface EdimCodeMarkConfigs {
  markName?: string;
}

const DEFAULT_CONFIGS: Required<EdimCodeMarkConfigs> = {
  markName: EDIM_CODE_MARK_NAME,
};

export const edimCodeMarks = (
  configs?: EdimCodeMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return ['code', { class: 'edim-code' }, 0];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
