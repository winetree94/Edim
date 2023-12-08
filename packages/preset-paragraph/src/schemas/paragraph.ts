import { NodeSpec } from 'prosemirror-model';
import { parseQuillTextAlign } from 'prosemirror-preset-core';

export interface ParagraphAttributes {
  align: 'left' | 'right' | 'center' | null;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const PMP_PARAGRAPH_NODE: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    attrs: {
      align: {
        default: 'left',
      },
      indent: {
        default: 0,
      },
    },
    group: 'block',
    parseDOM: [
      {
        tag: 'p',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const quillAlign = parseQuillTextAlign(dom);
          const indent = dom.getAttribute('data-indent');
          return {
            align: align || quillAlign || null,
            indent: indent || 0,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ParagraphAttributes;
      return [
        'p',
        {
          class: `pmp-paragraph pmp-paragraph-indent-${attrs.indent || 0}${
            attrs.align ? ` pmp-align-${attrs.align}` : ''
          }`,
          'data-text-align': attrs.align || 'left',
          'data-indent': attrs.indent || 0,
        },
        0,
      ];
    },
  },
};
