import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const image: Record<string, NodeSpec> = {
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(node) {
          const dom = node as HTMLElement;
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          };
        },
      },
    ],
    toDOM(node) {
      const { src, alt, title } = node.attrs;
      return ['img', { src, alt, title }];
    },
  },
};

export const Image = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...image,
    },
    marks: {},
    plugins: () => [],
  };
};
