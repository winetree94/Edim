import { NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import {
  createImagePlaceholderPlugin,
  ImagePlaceholderViewProvider,
} from './placeholder';
import { EditorView } from 'prosemirror-view';

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
          const viewportWidth = dom.dataset['viewportWidth'] || 80;
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

export interface ImageExtensionConfigs {
  placeholderViewProvider?: (view: EditorView) => ImagePlaceholderViewProvider;
}

export const Image =
  (configs: ImageExtensionConfigs): PMPluginsFactory =>
  () => {
    return {
      nodes: {
        ...image,
      },
      marks: {},
      plugins: () => {
        return [
          createImagePlaceholderPlugin({
            placeholderViewProvider: configs.placeholderViewProvider,
          }),
        ];
      },
    };
  };
