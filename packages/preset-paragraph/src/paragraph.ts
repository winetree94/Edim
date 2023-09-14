import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';
import {
  addListNodes,
  liftListItem,
  sinkListItem,
  splitListItem,
  wrapInList,
} from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';

const pDOM: DOMOutputSpec = ['p', { class: 'pmp-paragraph' }, 0];
const paragraph: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  },
};

const paragraphWithList = addListNodes(
  OrderedMap.from(paragraph),
  'paragraph block*',
  'block',
).toObject();

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType: NodeType) {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs['order'] == +match[1],
  );
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export function bulletListRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

export interface ParagraphPluginConfigs {
  addListNodes: boolean;
}

export const Paragraph =
  (pluginConfig: ParagraphPluginConfigs): PMPluginsFactory =>
  () => {
    const nodes = pluginConfig.addListNodes ? paragraphWithList : paragraph;
    return {
      nodes: nodes,
      marks: {},
      plugins: (schema) => {
        if (!pluginConfig.addListNodes) {
          return [
            keymap({
              'Shift-Ctrl-0': setBlockType(schema.nodes['paragraph']),
            }),
          ];
        }
        return [
          inputRules({
            rules: [
              orderedListRule(schema.nodes['ordered_list']),
              bulletListRule(schema.nodes['bullet_list']),
            ],
          }),
          keymap({
            'Shift-Ctrl-0': setBlockType(schema.nodes['paragraph']),
            'Shift-Ctrl-8': wrapInList(schema.nodes['bullet_list']),
            'Shift-Ctrl-9': wrapInList(schema.nodes['ordered_list']),
            Enter: splitListItem(schema.nodes['list_item']),
            'Mod-[': liftListItem(schema.nodes['list_item']),
            'Mod-]': sinkListItem(schema.nodes['list_item']),
          }),
        ];
      },
    };
  };
