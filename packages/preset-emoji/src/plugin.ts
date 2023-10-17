import { Plugin, PluginKey } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { Attrs, MarkSpec, NodeSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export interface EmojiAttribute {
  data_id: string;
}

const EmojiNodes: Record<string, NodeSpec> = {
  emoji: {
    inclusive: false,
    inline: true,
    attrs: {
      data_id: {
        default: '',
      },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img',
        getAttrs: (node) => {
          const dom = node as HTMLSpanElement;

          const currentEmoji = dom.classList.contains('pmp-emoji');
          const legacyEmoji = dom.classList.contains('emoji-img');

          console.log('currentEmoji', currentEmoji);
          console.log('legacyEmoji', legacyEmoji);

          if (!currentEmoji && !legacyEmoji) {
            return false;
          }

          if (legacyEmoji) {
            return {
              data_id: dom.getAttribute('key') || '',
            };
          }
          return {
            data_id: dom.getAttribute('data-id') || '',
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as EmojiAttribute;
      return [
        'img',
        {
          class: 'pmp-emoji',
          'data-id': attrs.data_id,
        },
      ];
    },
  },
};

export interface EmojiExtensionConfigs {}

export const EmojiExtension = (
  configs: EmojiExtensionConfigs,
): PMPluginsFactory => {
  return () => {
    return {
      nodes: {
        ...EmojiNodes,
      },
      marks: {},
      plugins: () => [],
    };
  };
};
