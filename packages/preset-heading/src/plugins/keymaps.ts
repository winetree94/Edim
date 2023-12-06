import { setBlockType } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { Node, NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin, Command, Transaction } from 'prosemirror-state';
import { HeadingAttributes } from '../schemas';

export interface PmpHeadingKeymapPluginConfigs {
  nodeType: NodeType;
  level: number;
}

const indentAllowedParents = ['doc'];

export const createPmpHeadingKeymapPlugins = (
  configs: PmpHeadingKeymapPluginConfigs,
): PMPlugin[] => {
  const headingKeymaps: Record<string, Command> = {};
  for (let i = 1; i <= configs.level; i++) {
    headingKeymaps['Ctrl-Alt-' + i] = setBlockType(configs.nodeType, {
      level: i,
    });
  }
  return [
    keymap(headingKeymaps),
    new PMPlugin({
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

          if (node.type !== configs.nodeType || resolvedPos.nodeBefore) {
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
    new PMPlugin({
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
                node.type === configs.nodeType &&
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
            return tr.setNodeMarkup(node.pos, configs.nodeType, {
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
};
