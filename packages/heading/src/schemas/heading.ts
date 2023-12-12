import { NodeSpec } from 'prosemirror-model';
import { parseQuillTextAlign } from '@edim-editor/core';

export const EDIM_HEADING_NODE_NAME = 'heading';
export const EDIM_DEFAULT_HEADING_LEVEL = 6;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingAttributes {
  level: HeadingLevel;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  align: 'left' | 'right' | 'center' | null;
}

export const edimHeadingNodes = (): Record<string, NodeSpec> => ({
  [EDIM_HEADING_NODE_NAME]: {
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
        const quillAlign = parseQuillTextAlign(dom);
        const indent = Number(dom.getAttribute('data-indent'));
        return {
          level,
          align: align || quillAlign || null,
          indent: indent || 0,
        };
      },
    })),
    toDOM(node) {
      const attrs = node.attrs as HeadingAttributes;
      const classes = ['edim-heading'];
      classes.push(`edim-heading-indent-${attrs.indent}`);
      if (attrs.align) {
        classes.push(`edim-align-${attrs.align}`);
      }
      return [
        'h' + attrs.level,
        {
          class: classes.join(' '),
          'data-text-align': attrs.align || 'left',
        },
        0,
      ];
    },
  },
});
