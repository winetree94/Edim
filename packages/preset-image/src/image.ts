import { NodeSpec } from 'prosemirror-model';
import {
  createImagePlaceholderPlugin,
  ImagePlaceholderViewProvider,
} from './placeholder';
import { EditorView } from 'prosemirror-view';

export interface ImageAttrs {
  src: string;
  alt: string;
  title: string;
  align: 'left' | 'center' | 'right';
  viewportWidth: number;
}

export const EDIM_IMAGE_NODES: Record<string, NodeSpec> = {
  image: {
    // inline: true,
    attrs: {
      src: { default: '' },
      alt: { default: null },
      title: { default: null },
      align: { default: 'center' },
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
          const align = dom.parentElement?.dataset['align'] || 'center';

          if (dom.classList.contains('edim-emoji')) {
            return false;
          }

          if (dom.getAttribute('key')) {
            return false;
          }

          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            align,
            viewportWidth,
          };
        },
      },
    ],
    toDOM(node) {
      const { src, alt, title, align, viewportWidth } =
        node.attrs as ImageAttrs;

      return [
        'div',
        {
          class: `edim-image-wrapper edim-image-align-${align}`,
          'data-text-align': align,
        },
        [
          'img',
          {
            src,
            alt,
            title,
            class: 'edim-image',
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

export interface EdimImagePluginConfigs {
  placeholderViewProvider?: (view: EditorView) => ImagePlaceholderViewProvider;
}

export const edimImagePlugins = (configs: EdimImagePluginConfigs) => {
  return [
    createImagePlaceholderPlugin({
      placeholderViewProvider: configs.placeholderViewProvider,
    }),
  ];
};
