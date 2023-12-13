import { NodeSpec } from 'prosemirror-model';
import { parseQuillTextAlign } from '@edim-editor/core';

export interface ParagraphAttributes {
  align: 'left' | 'right' | 'center' | null;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface EdimParagraphNodeConfigs {
  /**
   * allow text align
   *
   * @default true
   */
  allowAlign?: boolean;

  /**
   * allow indent
   *
   * @default true
   */
  allowIndent?: boolean;

  /**
   * node name
   *
   * @default "paragraph"
   */
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimParagraphNodeConfigs> = {
  allowAlign: true,
  allowIndent: true,
  nodeName: 'paragraph',
};

export const edimParagraphNodes = (
  configs?: EdimParagraphNodeConfigs,
): Record<string, NodeSpec> => {
  const _configs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    content: 'inline*',
    group: 'block',
    attrs: {},
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
      const classes = ['edim-paragraph'];
      classes.push(`edim-paragraph-indent-${attrs.indent || 0}`);
      if (attrs.align) {
        classes.push(`edim-align-${attrs.align}`);
      }
      return [
        'p',
        {
          class: classes.join(' '),
          'data-text-align': attrs.align || 'left',
          'data-indent': attrs.indent || 0,
        },
        0,
      ];
    },
  };

  if (_configs.allowAlign) {
    nodeSpec.attrs!['align'] = {
      default: 'left',
    };
  }

  if (_configs.allowIndent) {
    nodeSpec.attrs!['indent'] = {
      default: 0,
    };
  }

  return {
    [_configs.nodeName]: nodeSpec,
  };
};
