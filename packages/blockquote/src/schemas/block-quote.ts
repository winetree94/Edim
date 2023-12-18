import { NodeSpec } from 'prosemirror-model';

export const EDIM_BLOCKQUOTE_NODE_NAME = 'blockquote';

export interface EdimBlockquoteNodeConfigs {
  multiline?: boolean;
}

const DEFAULT_CONFIGS: Required<EdimBlockquoteNodeConfigs> = {
  multiline: true,
};

export const edimBlockquoteNodes = (
  configs?: EdimBlockquoteNodeConfigs,
): Record<string, NodeSpec> => {
  const _configs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    content: 'paragraph',
    group: 'block disable-paragraph-attributes',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return [
        'blockquote',
        {
          class: 'pmp-blockquote',
        },
        0,
      ];
    },
  };

  if (_configs.multiline) {
    nodeSpec.content = 'paragraph+';
  }

  return {
    [EDIM_BLOCKQUOTE_NODE_NAME]: nodeSpec,
  };
};
