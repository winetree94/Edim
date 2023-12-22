import { MarkSpec } from 'prosemirror-model';

export const EDIM_MENTION_DEFAULT_MARK_NAME = 'mention';

export interface MentionAttrs {
  data_id: string;
}

export interface EdimMentionMarkConfigs {
  markName?: string;
}

const DEFAULT_CONFIGS: Required<EdimMentionMarkConfigs> = {
  markName: EDIM_MENTION_DEFAULT_MARK_NAME,
};

export const edimMentionMarks = (
  configs?: EdimMentionMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    inclusive: false,
    excludes: '_',
    attrs: {
      data_id: {
        default: '',
      },
    },
    parseDOM: [
      {
        tag: 'span',
        getAttrs: (node) => {
          const dom = node as HTMLSpanElement;
          if (!dom.classList.contains('edim-mention')) {
            return false;
          }
          return {
            data_id: dom.getAttribute('data-id') || '',
          };
        },
      },
      // for legacy
      {
        tag: 'a',
        getAttrs: (node) => {
          const dom = node as HTMLAnchorElement;
          const data_id = dom.dataset['mentionId'];
          if (!data_id) {
            return false;
          }
          return {
            data_id,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as MentionAttrs;
      return [
        'span',
        {
          class: 'edim-mention',
          'data-id': attrs.data_id,
        },
        0,
      ];
    },
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
