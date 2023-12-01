import { NodeSpec } from "prosemirror-model";

export interface ParagraphAttributes {
  textAlign: 'left' | 'right' | 'center' | null;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const PMP_PARAGRAPH_NODE: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    attrs: {
      textAlign: {
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
          const indent = dom.getAttribute('data-indent');
          return {
            align: align || null,
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
            attrs.textAlign ? ` pmp-align-${attrs.textAlign}` : ''
          }`,
          'data-text-align': attrs.textAlign || 'left',
          'data-indent': attrs.indent || 0,
        },
        0,
      ];
    },
  },
};