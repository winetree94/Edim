import { setBlockType } from 'prosemirror-commands';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingAttributes {
  level: HeadingLevel;
  textAlign: 'left' | 'right' | 'center' | null;
}

const heading: Record<string, NodeSpec> = {
  heading: {
    attrs: {
      level: { default: 1 },
      textAlign: { default: 'left' },
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      {
        tag: 'h1',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 1,
            align: align || null,
          };
        },
      },
      {
        tag: 'h2',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 2,
            align: align || null,
          };
        },
      },
      {
        tag: 'h3',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 3,
            align: align || null,
          };
        },
      },
      {
        tag: 'h4',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 4,
            align: align || null,
          };
        },
      },
      {
        tag: 'h5',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 5,
            align: align || null,
          };
        },
      },
      {
        tag: 'h6',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          return {
            level: 6,
            align: align || null,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as HeadingAttributes;
      return [
        'h' + attrs.level,
        {
          class: `pmp-heading${
            attrs.textAlign ? ` pmp-align-${attrs.textAlign}` : ''
          }`,
          'data-text-align': attrs.textAlign || 'left',
        },
        0,
      ];
    },
  },
};

export function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(
    new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    (match) => ({ level: match[1].length }),
  );
}

export interface HeadingConfig {
  level: HeadingLevel;
}

export const Heading = (config: HeadingConfig): PMPluginsFactory => {
  return () => {
    return {
      nodes: {
        ...heading,
      },
      marks: {},
      plugins: (schema: Schema) => {
        const headingKeymaps: Record<string, Command> = {};
        for (let i = 1; i <= config.level; i++) {
          headingKeymaps['Shift-Ctrl-' + i] = setBlockType(
            schema.nodes['heading'],
            {
              level: i,
            },
          );
        }
        return [
          inputRules({
            rules: [headingRule(schema.nodes['heading'], config.level)],
          }),
          keymap(headingKeymaps),
        ];
      },
    };
  };
};
