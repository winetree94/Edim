import { parseQuillTextAlign } from '@edim-editor/core';
import { NodeSpec } from 'prosemirror-model';

export type EdimHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type EdimHeadingAlign = 'left' | 'right' | 'center' | null;

export const EDIM_HEADING_DEFAULT_NODE_NAME = 'heading';
export const EDIM_HEADING_ALLOWED_LEVELS: EdimHeadingLevel[] = [
  1, 2, 3, 4, 5, 6,
];

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
  };
}

export interface EdimHeadingNodeConfigs {
  allowAlign?: boolean;
  levels?: EdimHeadingLevel[];
  nodeName?: string;
}

const EDIM_DEFAULT_HEADING_NODE_CONFIGS: Required<EdimHeadingNodeConfigs> = {
  allowAlign: true,
  levels: EDIM_HEADING_ALLOWED_LEVELS.slice(),
  nodeName: EDIM_HEADING_DEFAULT_NODE_NAME,
};

export const edimHeadingNodes = (
  configs?: EdimHeadingNodeConfigs,
): Record<string, EdimHeadingNodeSpec> => {
  const mergedConfigs = {
    ...EDIM_DEFAULT_HEADING_NODE_CONFIGS,
    ...configs,
  };

  if (
    !mergedConfigs.levels.every((level) =>
      EDIM_HEADING_ALLOWED_LEVELS.includes(level),
    )
  ) {
    throw new Error('Invalid heading levels');
  }

  const nodeSpec: EdimHeadingNodeSpec = {
    attrs: {
      level: {
        default: mergedConfigs.levels[0],
      },
      align: {
        default: 'left',
      },
    },
    meta: {
      levels: mergedConfigs.levels,
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: mergedConfigs.levels.map((level) => ({
      tag: `h${level}`,
      getAttrs: (node) => {
        const dom = node as HTMLElement;
        const align = dom.getAttribute('data-text-align');
        const quillAlign = parseQuillTextAlign(dom);

        return {
          level,
          align: align || quillAlign || null,
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
