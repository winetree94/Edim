import { MarkSpec } from 'prosemirror-model';

export const EDIM_SUPERSCRIPT_MARK_NAME = 'superscript';

export interface EdimSuperscriptMarkConfigs {
  /**
   * mark name
   *
   * @default "subscript"
   */
  markName?: string;

  subscriptMarkName?: string;
}

const DEFAULT_CONFIGS: Required<EdimSuperscriptMarkConfigs> = {
  markName: EDIM_SUPERSCRIPT_MARK_NAME,
  subscriptMarkName: '',
};

export const edimSuperscriptMarks = (
  configs?: EdimSuperscriptMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    parseDOM: [{ tag: 'sup' }],
    toDOM() {
      return ['sup', 0];
    },
  };

  if (mergedConfigs.subscriptMarkName) {
    markSpec.excludes = mergedConfigs.subscriptMarkName;
  }

  return {
    [EDIM_SUPERSCRIPT_MARK_NAME]: markSpec,
  };
};
