import { AttributeSpec, NodeSpec } from 'prosemirror-model';
import { parseQuillTextAlign } from '@edim-editor/core';

export const EDIM_HEADING_NODE_NAME = 'heading';
export const EDIM_DEFAULT_HEADING_LEVEL = 6;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface EdimHeadingAttrs {
  level: HeadingLevel;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  align: 'left' | 'right' | 'center' | null;
}

export interface EdimHeadingNodeSpec extends NodeSpec {
  configs?: EdimHeadingNodeConfigs;
}

export interface EdimHeadingNodeConfigs {
  allowIndent?: boolean;
  allowAlign?: boolean;
  level?: HeadingLevel[];
}

const EDIM_DEFAULT_HEADING_NODE_CONFIGS: Required<EdimHeadingNodeConfigs> = {
  allowIndent: true,
  allowAlign: true,
  level: [1, 2, 3, 4, 5, 6],
};

interface NT<
  ATTRIBUTE_SPECS extends { [key: string]: AttributeSpec } = {
    [key: string]: AttributeSpec;
  },
> extends NodeSpec {
  attrs: ATTRIBUTE_SPECS;
}

export const edimHeadingNodes = (
  configs?: EdimHeadingNodeConfigs,
): Record<string, NodeSpec> => {
  const _configs = {
    ...EDIM_DEFAULT_HEADING_NODE_CONFIGS,
    ...configs,
  };

  const nodeSpec: EdimHeadingNodeSpec = {
    attrs: {
      level: {
        default: 1,
      },
      indent: {
        default: 0,
      },
      align: {
        default: 'left',
      },
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
      const attrs = node.attrs as EdimHeadingAttrs;
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
  };

  return {
    [EDIM_HEADING_NODE_NAME]: nodeSpec,
  };
};
