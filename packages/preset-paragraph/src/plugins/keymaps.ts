import { NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ParagraphAttributes } from '../schemas';

export interface PmpParagraphKeymapPluginConfigs {
  nodeType: NodeType;
}

export const createPmpParagraphKeymapPlugins = (
  configs: PmpParagraphKeymapPluginConfigs,
) => {
  return [
    keymap({
      'Ctrl-Alt-0': setBlockType(configs.nodeType),
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
  ];
};
