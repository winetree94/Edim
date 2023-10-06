import { Plugin, PluginKey } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { MarkSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { getMentionRange } from './utils';
import { MentionState } from './state';
import { MentionView, MentionExtentionView } from './view';

export interface MentionAttribute {
  data_id: string;
}

export interface MentionExtensionConfigs {
  schemeKey: string;
  mentionKey: string;
  elementName?: string;
  view: (
    view: EditorView,
    plugin: Plugin<MentionState>,
  ) => MentionExtentionView;
}

export const Mention = (configs: MentionExtensionConfigs): PMPluginsFactory => {
  const defaultPluginState: MentionState = {
    actived: false,
    keyword: '',
  };

  return () => {
    let extensionView!: MentionView;

    const mentionPlugin: Plugin<MentionState> = new Plugin<MentionState>({
      key: new PluginKey('mention'),
      appendTransaction: (transactions, oldState, newState) => {
        const tr = newState.tr;
        let modified = false;

        if (!transactions.some((transaction) => transaction.docChanged)) {
          return;
        }

        newState.doc.descendants((node, pos) => {
          const hasMention = node.marks.some(
            (mark) => mark.type.name === configs.schemeKey,
          );
          if (!node.isText || !hasMention) {
            return;
          }
          const oldNode = oldState.doc.nodeAt(pos);
          const oldNodeHasMention = oldNode?.marks.some(
            (mark) => mark.type.name === configs.schemeKey,
          );

          if (
            oldNode &&
            oldNodeHasMention &&
            oldNode.isText &&
            node.text !== oldNode.text
          ) {
            tr.removeMark(
              pos,
              pos + node.nodeSize,
              newState.schema.marks[configs.schemeKey],
            );
            modified = true;
          }
        });

        return modified ? tr : null;
      },
      state: {
        init: () => ({
          type: configs.schemeKey,
          actived: false,
          keyword: '',
        }),
        apply(tr, value, oldState, newState) {
          const range = getMentionRange(
            newState,
            configs.mentionKey,
            configs.schemeKey,
          );

          if (!range) {
            return defaultPluginState;
          }

          return {
            actived: true,
            keyword: range.keyword,
          };
        },
      },
      props: {
        handleKeyDown: (view, event) => {
          const range = getMentionRange(
            view.state,
            configs.mentionKey,
            configs.schemeKey,
          );

          if (!range) {
            return false;
          }

          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            return extensionView.onArrowKeydown(event);
          } else if (event.key === 'Enter') {
            const mentionValue = extensionView.onSubmit(event);

            if (!mentionValue) {
              return true;
            }

            view.dispatch(
              view.state.tr
                .replaceWith(
                  range.rangeStart,
                  range.rangeEnd,
                  view.state.schema.text(
                    configs.mentionKey + mentionValue.text,
                  ),
                )
                .addMark(
                  range.rangeStart,
                  range.rangeStart + mentionValue.text.length + 1,
                  view.state.schema.marks[configs.schemeKey].create({
                    data_id: mentionValue.dataId,
                  }),
                ),
            );
            return true;
          }

          return false;
        },
      },
      view: (editorView) => {
        const view = new MentionView(
          editorView,
          configs,
          mentionPlugin,
          configs.view(editorView, mentionPlugin),
        );
        extensionView = view;
        return view;
      },
    });

    return {
      nodes: {},
      marks: {
        [configs.schemeKey]: {
          inclusive: false,
          attrs: {
            data_id: '',
          },
          parseDOM: [
            {
              tag: 'span',
              getAttrs: (node): MentionAttribute => {
                const dom = node as HTMLSpanElement;
                return {
                  data_id: dom.getAttribute('data-id') || '',
                };
              },
            },
          ],
          toDOM(node) {
            const attrs = node.attrs as MentionAttribute;
            return [
              'span',
              {
                class: 'pmp-mention',
                'data-id': attrs.data_id,
              },
              0,
            ];
          },
        } as MarkSpec,
      },
      plugins: () => [mentionPlugin],
    };
  };
};
