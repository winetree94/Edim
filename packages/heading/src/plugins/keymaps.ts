import { setBlockType } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { Node, NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin, Command, Transaction } from 'prosemirror-state';
import { EDIM_DEFAULT_HEADING_LEVEL, EdimHeadingAttrs } from '../schemas';
import { checkHeadingNodeType } from '../utils';

export interface EdimHeadingKeymapPluginConfigs {
  nodeType?: NodeType;
  level?: number;
}

const indentAllowedParents = ['doc'];

export const edimHeadingKeymapPlugins = (
  configs?: EdimHeadingKeymapPluginConfigs,
): PMPlugin[] => {
  const level = configs?.level || EDIM_DEFAULT_HEADING_LEVEL;
  const headingKeymaps: Record<string, Command> = {};
  for (let i = 1; i <= level; i++) {
    headingKeymaps['Alt-Mod-' + i] = (state, dispatch) => {
      const nodeType = checkHeadingNodeType(configs?.nodeType)(state);
      return setBlockType(nodeType, {
        level: i,
      })(state, dispatch);
    };
  }
  return [
    keymap(headingKeymaps),
    new PMPlugin({
      props: {
        handleKeyDown: (view, event) => {
          const nodeType = checkHeadingNodeType(configs?.nodeType)(view.state);
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

          if (node.type !== nodeType || resolvedPos.nodeBefore) {
            return false;
          }

          const attrs = node.attrs as EdimHeadingAttrs;
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
          const nodeType = checkHeadingNodeType(configs?.nodeType)(view.state);
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
                node.type === nodeType &&
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
            const attrs = node.node.attrs as EdimHeadingAttrs;
            const targetIndent = Math.max(
              0,
              Math.min(attrs.indent + (shiftPressed ? -1 : 1), 6),
            );
            return tr.setNodeMarkup(node.pos, nodeType, {
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
