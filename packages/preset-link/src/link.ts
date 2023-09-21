import { Plugin, PluginKey } from 'prosemirror-state';
import { MarkSpec, Node } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const link: Record<string, MarkSpec> = {
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

export interface LinkPluginState {
  rangeIncludesLink: boolean;
  rangeInsideLink: boolean;
}

const defaultPluginState = {
  rangeIncludesLink: false,
  rangeInsideLink: false,
};

export const Link = (): PMPluginsFactory => () => {
  const linkPlugin = new Plugin<LinkPluginState>({
    key: new PluginKey('link'),
    state: {
      init: () => ({ ...defaultPluginState }),
      apply: (tr, pluginState, oldState, newState) => {
        const nextPluginState = { ...defaultPluginState };
        nextPluginState.rangeInsideLink = true;

        const rangeNodes: Node[] = [];

        newState.doc.nodesBetween(
          tr.selection.from,
          tr.selection.to,
          (node) => {
            rangeNodes.push(node);
          },
        );

        const textNodes = rangeNodes.filter(
          (node) => node.type.name === newState.schema.nodes['text'].name,
        );

        if (!textNodes.length) {
          nextPluginState.rangeInsideLink = false;
        }

        textNodes.forEach((node) => {
          const hasLinkNode = node.marks.some(
            (mark) => mark.type === newState.schema.marks['link'],
          );
          if (hasLinkNode) {
            nextPluginState.rangeIncludesLink = true;
          } else {
            nextPluginState.rangeInsideLink = false;
          }
        });

        return nextPluginState;
      },
    },
  });

  return {
    nodes: {},
    marks: {
      ...link,
    },
    plugins: () => [linkPlugin],
  };
};
