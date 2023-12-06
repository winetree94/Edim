import { NodeSpec } from 'prosemirror-model';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingAttributes {
  level: HeadingLevel;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  align: 'left' | 'right' | 'center' | null;
}

export const PMP_HEADING_NODE: Record<string, NodeSpec> = {
  heading: {
    attrs: {
      level: { default: 1 },
      indent: { default: 0 },
      align: { default: 'left' },
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      getAttrs: (node) => {
        const dom = node as HTMLElement;
        const align = dom.getAttribute('data-text-align');
        const indent = Number(dom.getAttribute('data-indent'));
        return {
          level,
          align: align || null,
          indent: indent || 0,
        };
      },
    })),
    toDOM(node) {
      const attrs = node.attrs as HeadingAttributes;
      return [
        'h' + attrs.level,
        {
          class: `pmp-heading pmp-heading-indent-${attrs.indent || 0}${
            attrs.align ? ` pmp-align-${attrs.align}` : ''
          }`,
          'data-text-align': attrs.align || 'left',
        },
        0,
      ];
    },
  },
};
