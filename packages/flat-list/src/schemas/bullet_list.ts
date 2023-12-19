import { NodeSpec } from 'prosemirror-model';
import { isQuillTaskList } from '@edim-editor/core';

export const EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME = 'bullet_list';

export interface EdimFlatBulletListNodeConfigs {
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimFlatBulletListNodeConfigs> = {
  nodeName: EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
};

export const edimFlatBulletListNodes = (
  configs?: EdimFlatBulletListNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    parseDOM: [
      {
        tag: 'ul',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          if (isQuillTaskList(dom)) {
            return false;
          }
          return {};
        },
      },
    ],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return [
        'ul',
        {
          class: 'edim-bullet-list',
        },
        0,
      ];
    },
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};
