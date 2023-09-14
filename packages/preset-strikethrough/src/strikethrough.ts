import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const strikethroughDOM: DOMOutputSpec = ['s', 0];
const strikethrough: Record<string, MarkSpec> = {
  strikethrough: {
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
};

export const Strikethrough = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...strikethrough,
    },
    plugins: () => [],
  };
};
