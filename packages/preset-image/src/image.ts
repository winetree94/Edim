import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface ImageAttrs {
  src: string;
  alt: string;
  title: string;
  textAlign: 'left' | 'center' | 'right';
  viewportWidth: number;
}

const image: Record<string, NodeSpec> = {
  image: {
    // inline: true,
    attrs: {
      src: { default: '' },
      alt: { default: null },
      title: { default: null },
      textAlign: { default: 'center' },
      viewportWidth: { default: 80 },
    },
    group: 'block',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(node) {
          const dom = node as HTMLElement;
          const viewportWidth = dom.dataset['viewportWidth'];
          const textAlign = dom.parentElement?.dataset['textAlign'] || 'center';

          if (dom.classList.contains('pmp-emoji')) {
            return false;
          }

          if (dom.getAttribute('key')) {
            return false;
          }

          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            textAlign,
            viewportWidth,
          };
        },
      },
    ],
    toDOM(node) {
      const { src, alt, title, textAlign, viewportWidth } =
        node.attrs as ImageAttrs;

      return [
        'div',
        {
          class: `pmp-image-wrapper pmp-image-align-${textAlign}`,
          'data-text-align': textAlign,
        },
        [
          'img',
          {
            src,
            alt,
            title,
            class: 'pmp-image',
            style: `width: ${viewportWidth}%`,
            'data-viewport-width': viewportWidth,
          },
        ],
      ];
    },
  },
};

export const Image = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...image,
    },
    marks: {},
    plugins: () => {
      const decorationPluginKey = new PluginKey<DecorationSet>(
        'decorationPlugin',
      );
      return [
        new Plugin({
          key: decorationPluginKey,
          state: {
            init() {
              return DecorationSet.empty;
            },
            apply(tr, set) {
              // Adjust decoration positions to changes made by the transaction
              set = set.map(tr.mapping, tr.doc);
              // See if the transaction adds or removes any placeholders
              const action = tr.getMeta(this as any);
              if (action && action.add) {
                const widget = document.createElement('placeholder');
                const deco = Decoration.widget(action.add.pos, widget, {
                  id: action.add.id,
                });
                set = set.add(tr.doc, [deco]);
              } else if (action && action.remove) {
                set = set.remove(
                  set.find(
                    undefined,
                    undefined,
                    (spec) => spec.id == action.remove.id,
                  ),
                );
              }
              console.log(set);
              return set;
            },
          },
          props: {
            decorations(state) {
              return this.getState(state);
            },
          },
        }),
      ];
    },
  };
};
