import { parseQuillTextAlign } from '@edim-editor/core';
import { NodeSpec } from 'prosemirror-model';

export const EDIM_HEADING_DEFAULT_NODE_NAME = 'heading';
export const EDIM_DEFAULT_HEADING_LEVEL = 6;

export type EdimHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type EdimHeadingAlign = 'left' | 'right' | 'center' | null;

export interface EdimHeadingAttrs {
  level: EdimHeadingLevel;
  align: EdimHeadingAlign;
}

export interface EdimHeadingNodeSpec extends NodeSpec {
  attrs: {
    level: {
      default: number;
    };
    align: {
      default: EdimHeadingAlign;
    };
  };
  meta: {
    levels: EdimHeadingLevel[];
    maxIndent: number;
  };
}

export interface EdimHeadingNodeConfigs {
  allowIndent?: boolean;
  allowAlign?: boolean;
  level?: EdimHeadingLevel[];
  nodeName?: string;
}

const EDIM_DEFAULT_HEADING_NODE_CONFIGS: Required<EdimHeadingNodeConfigs> = {
  allowIndent: true,
  allowAlign: true,
  level: [1, 2, 3, 4, 5, 6],
  nodeName: EDIM_HEADING_DEFAULT_NODE_NAME,
};

export const edimHeadingNodes = (
  configs?: EdimHeadingNodeConfigs,
): Record<string, EdimHeadingNodeSpec> => {
  const mergedConfigs = {
    ...EDIM_DEFAULT_HEADING_NODE_CONFIGS,
    ...configs,
  };

  const nodeSpec: EdimHeadingNodeSpec = {
    attrs: {
      level: {
        default: 1,
      },
      align: {
        default: 'left',
      },
    },
    meta: {
      levels: mergedConfigs.level,
      maxIndent: 6,
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
    [mergedConfigs.nodeName]: nodeSpec,
  };
};
