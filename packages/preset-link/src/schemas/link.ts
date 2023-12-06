import { MarkSpec } from 'prosemirror-model';

export const PMP_LINK_MARK: Record<string, MarkSpec> = {
  link: {
    attrs: {
      href: { default: null },
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
      return ['a', { href, title, class: 'pmp-link' }, 0];
    },
  },
};