import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const doc: Record<string, NodeSpec> = {
  doc: {
    content: 'block+',
  },
};

const text: Record<string, NodeSpec> = {
  text: {
    group: 'inline',
  },
};

const pDOM: DOMOutputSpec = ['p', { class: 'pmp-paragraph' }, 0];
const paragraph: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  },
};

export const Document = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...doc,
      ...text,
      ...paragraph,
    },
    marks: {},
    plugins: () => [],
  };
};
