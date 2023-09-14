import { MarkSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const link: Record<string, MarkSpec> = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(node) {
          const dom = node as HTMLElement;
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        },
      },
    ],
    toDOM(node) {
      const href = node.attrs['href'] as string;
      const title = node.attrs['title'] as string;
      return ['a', { href, title }, 0];
    },
  },
};

export const Link = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {
      ...link,
    },
    plugins: () => [],
  };
};
