import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

export const PMP_DOC_NODE: Record<string, NodeSpec> = {
  doc: {
    group: 'block-container',
    content: 'block+',
  },
};

export const Document = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...PMP_DOC_NODE,
    },
    marks: {},
    plugins: () => [],
  };
};
