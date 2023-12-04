import { setBlockType } from 'prosemirror-commands';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { Node, NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { Command, Plugin, PluginKey, Transaction } from 'prosemirror-state';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingAttributes {
  level: HeadingLevel;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  textAlign: 'left' | 'right' | 'center' | null;
}

const indentAllowedParents = ['doc'];

export const PMP_HEADING_NODE: Record<string, NodeSpec> = {
  heading: {
    attrs: {
      level: { default: 1 },
      indent: { default: 0 },
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
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 1,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
      {
        tag: 'h2',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 2,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
      {
        tag: 'h3',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 3,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
      {
        tag: 'h4',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 4,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
      {
        tag: 'h5',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 5,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
      {
        tag: 'h6',
        getAttrs: (node) => {
          const dom = node as HTMLElement;
          const align = dom.getAttribute('data-text-align');
          const indent = Number(dom.getAttribute('data-indent'));
          return {
            level: 6,
            align: align || null,
            indent: indent || 0,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as HeadingAttributes;
      return [
        'h' + attrs.level,
        {
          class: `pmp-heading pmp-heading-indent-${attrs.indent || 0}${
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

export interface CreatePmpHeadingPluginConfigs {
  nodeType: NodeType;
  level: number;
}

export const createPmpHeadingPlugins = (
  configs: CreatePmpHeadingPluginConfigs,
) => {
  const headingKeymaps: Record<string, Command> = {};
  for (let i = 1; i <= configs.level; i++) {
    headingKeymaps['Ctrl-Alt-' + i] = setBlockType(configs.nodeType, {
      level: i,
    });
  }
  return [
    inputRules({
      rules: [headingRule(configs.nodeType, configs.level)],
    }),
    keymap(headingKeymaps),
    new Plugin({
      key: new PluginKey('headingBackspacePlugin'),
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

          if (node.type.name !== 'heading' || resolvedPos.nodeBefore) {
            return false;
          }

          const attrs = node.attrs as HeadingAttributes;
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
      key: new PluginKey('headingPlugin'),
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
              if (
                node.type.name === 'heading' &&
                indentAllowedParents.includes(parent?.type.name || '')
              ) {
                nodes.push({ node, pos, parent });
              }
            },
          );

          if (nodes.length === 0) {
            return false;
          }

          const tr = nodes.reduce<Transaction>((tr, node) => {
            const attrs = node.node.attrs as HeadingAttributes;
            const targetIndent = Math.max(
              0,
              Math.min(attrs.indent + (shiftPressed ? -1 : 1), 6),
            );
            return tr.setNodeMarkup(
              node.pos,
              view.state.schema.nodes['heading'],
              {
                ...attrs,
                indent: targetIndent,
              },
            );
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
};
