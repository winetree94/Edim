import { Node, NodeSpec, NodeType, Schema } from 'prosemirror-model';
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
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

export interface ParagraphAttributes {
  textAlign: 'left' | 'right' | 'center' | null;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const paragraph: Record<string, NodeSpec> = {
  paragraph: {
    content: 'inline*',
    attrs: {
      textAlign: {
        default: 'left',
      },
      indent: {
        default: 0,
      },
    },
    group: 'block',
    parseDOM: [
      {
        tag: 'p',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = dom.getAttribute('data-indent');
          return {
            align: align || null,
            indent: indent || 0,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ParagraphAttributes;
      return [
        'p',
        {
          class: `pmp-paragraph pmp-paragraph-indent-${attrs.indent || 0}${
            attrs.textAlign ? ` pmp-align-${attrs.textAlign}` : ''
          }`,
          'data-text-align': attrs.textAlign || 'left',
          'data-indent': attrs.indent || 0,
        },
        0,
      ];
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
      plugins: (schema: Schema) => {
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
          new Plugin({
            key: new PluginKey('paragraphBackspacePlugin'),
            props: {
              handleKeyDown: (view, event) => {
                const backspacePressed = event.key === 'Backspace';
                const metaPressed = event.metaKey;
                const selection = view.state.selection;

                if (
                  metaPressed ||
                  !backspacePressed ||
                  !selection.empty ||
                  selection.from !== selection.to
                ) {
                  return false;
                }

                const resolvedPos = view.state.doc.resolve(selection.from);
                const node = resolvedPos.node();

                if (node.type.name !== 'paragraph' || resolvedPos.nodeBefore) {
                  return false;
                }

                const attrs = node.attrs as ParagraphAttributes;
                const targetIndent = Math.max(0, attrs.indent - 1);

                if (targetIndent === attrs.indent) {
                  return false;
                }

                const tr = view.state.tr.setNodeMarkup(
                  resolvedPos.pos - 1,
                  undefined,
                  {
                    ...attrs,
                    indent: targetIndent,
                  },
                );

                if (!tr.docChanged) {
                  return false;
                }

                view.dispatch(tr);
                return true;
              },
            },
          }),
          new Plugin({
            key: new PluginKey('paragraphPlugin'),
            props: {
              handleKeyDown: (view, event) => {
                const tabPressed = event.key === 'Tab';
                const shiftPressed = event.shiftKey;

                if (!tabPressed) {
                  return false;
                }

                const nodes: {
                  node: Node;
                  pos: number;
                  parent: Node | null;
                }[] = [];

                view.state.doc.nodesBetween(
                  view.state.selection.from,
                  view.state.selection.to,
                  (node, pos, parent) => {
                    if (node.type.name === 'paragraph') {
                      nodes.push({ node, pos, parent });
                    }
                  },
                );

                if (nodes.length === 0) {
                  return false;
                }

                const tr = nodes.reduce<Transaction>((tr, node) => {
                  const attrs = node.node.attrs as ParagraphAttributes;
                  const targetIndent = Math.max(
                    0,
                    Math.min(attrs.indent + (shiftPressed ? -1 : 1), 6),
                  );
                  return tr.setNodeMarkup(node.pos, undefined, {
                    ...attrs,
                    indent: targetIndent,
                  });
                }, view.state.tr);

                if (!tr.docChanged) {
                  return false;
                }

                event.preventDefault();
                view.dispatch(tr);
                return false;
              },
            },
          }),
        ];
      },
    };
  };
