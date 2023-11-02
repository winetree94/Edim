import { NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { Plugin, PluginKey } from 'prosemirror-state';

export interface ParagraphAttributes {
  textAlign: 'left' | 'right' | 'center' | null;
  indent: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const PMP_PARAGRAPH_NODE: Record<string, NodeSpec> = {
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

export interface ParagraphPluginConfigs {}

export const createPmpParagraphPlugins = (nodeType: NodeType): Plugin[] => {
  return [
    keymap({
      'Ctrl-Alt-0': setBlockType(nodeType),
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

export const Paragraph =
  (pluginConfig: ParagraphPluginConfigs): PMPluginsFactory =>
  () => {
    const nodes = PMP_PARAGRAPH_NODE;
    return {
      nodes: nodes,
      marks: {},
      plugins: (schema: Schema) => {
        return [
          keymap({
            'Ctrl-Alt-0': setBlockType(schema.nodes['paragraph']),
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
      },
    };
  };
