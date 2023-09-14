import { setBlockType } from 'prosemirror-commands';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const heading: Record<string, NodeSpec> = {
  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) {
      return ['h' + node.attrs['level'], 0];
    },
  },
};

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` ssicigns.
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
      plugins: (schema) => {
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
