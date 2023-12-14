import { NodeSpec } from 'prosemirror-model';
import { parseQuillTextAlign } from '@edim-editor/core';

export interface ParagraphAttributes {
  align: 'left' | 'right' | 'center' | null;
}

export interface EdimParagraphNodeConfigs {
  /**
   * allow text align
   *
   * @default true
   */
  allowAlign?: boolean;

  /**
   * node name
   *
   * @default "paragraph"
   */
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimParagraphNodeConfigs> = {
  allowAlign: true,
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
      if (attrs.align) {
        classes.push(`edim-align-${attrs.align}`);
      }
      return [
        'p',
        {
          class: classes.join(' '),
          'data-text-align': attrs.align || 'left',
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

  return {
    [_configs.nodeName]: nodeSpec,
  };
};
