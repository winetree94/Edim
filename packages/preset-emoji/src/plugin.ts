import { NodeSpec } from 'prosemirror-model';

export interface EmojiAttribute {
  data_id: string;
}

export const EDIM_EMOJI_NODE: Record<string, NodeSpec> = {
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

          const currentEmoji = dom.classList.contains('edim-emoji');
          const legacyEmoji = dom.classList.contains('emoji-img');

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
          class: 'edim-emoji',
          'data-id': attrs.data_id,
        },
      ];
    },
  },
};
