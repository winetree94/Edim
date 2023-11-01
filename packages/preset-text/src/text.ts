import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

export const PMP_TEXT_NODE: Record<string, NodeSpec> = {
  text: {
    group: 'inline',
  },
};

export const Text = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...PMP_TEXT_NODE,
    },
    marks: {},
    plugins: () => [],
  };
};
