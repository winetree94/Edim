import { NodeSpec } from 'prosemirror-model';

export const EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME = 'ordered_list';

export interface EdimFlatOrderedListNodeConfigs {
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimFlatOrderedListNodeConfigs> = {
  nodeName: EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
};

export const edimFlatOrderedListNodes = (
  configs?: EdimFlatOrderedListNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    parseDOM: [
      {
        tag: 'ol',
        getAttrs() {
          return {};
        },
      },
    ],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return [
        'ol',
        {
          class: 'edim-ordered-list',
        },
        0,
      ];
    },
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};
