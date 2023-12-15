import { MarkSpec } from 'prosemirror-model';

export const EDIM_LINK_DEFAULT_MARK_NAME = 'link';

export const edimLinkMarks = (): Record<string, MarkSpec> => ({
  [EDIM_LINK_DEFAULT_MARK_NAME]: {
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
      return ['a', { href, title, class: 'edim-link' }, 0];
    },
  },
});
