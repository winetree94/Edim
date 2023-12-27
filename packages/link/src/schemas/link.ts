import { MarkSpec } from 'prosemirror-model';

export const EDIM_LINK_DEFAULT_MARK_NAME = 'link';

export interface EdimLinkMarkConfigs {
  markName?: string;
}

const DEFAULT_CONFIGS = {
  markName: EDIM_LINK_DEFAULT_MARK_NAME,
};

export const edimLinkMarks = (
  configs?: EdimLinkMarkConfigs,
): Record<string, MarkSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const markSpec: MarkSpec = {
    attrs: {
      href: { default: null },
      title: { default: null },
    },
    // inclusive: false,
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
  };

  return {
    [mergedConfigs.markName]: markSpec,
  };
};
