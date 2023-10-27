import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { MarkSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { getMentionRange } from './utils';
import { MentionPluginState } from './state';
// import { MentionExtentionView } from './view';

export interface MentionAttribute {
  data_id: string;
}

export interface MentionPluginView extends PluginView {
  handleKeydown?(view: EditorView, event: KeyboardEvent): boolean | void;
}

export interface MentionExtensionConfigs {
  // view: (
  //   view: EditorView,
  //   plugin: Plugin<MentionPluginState>,
  // ) => MentionExtentionView;
  view?: (
    view: EditorView,
    plugin: PluginKey<MentionPluginState>,
  ) => MentionPluginView;
}

export const Mention = (configs: MentionExtensionConfigs): PMPluginsFactory => {
  const defaultPluginState: MentionPluginState = {
    active: false,
    keyword: '',
  };

  return () => {
    const mentionPluginKey = new PluginKey<MentionPluginState>('mention');
    let mentionPluginView: MentionPluginView | null = null;
    // let extensionView!: MentionPluginView;

    const mentionPlugin: Plugin<MentionPluginState> =
      new Plugin<MentionPluginState>({
        key: mentionPluginKey,
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          if (!transactions.some((transaction) => transaction.docChanged)) {
            return;
          }

          newState.doc.descendants((node, pos) => {
            const hasMention = node.marks.some(
              (mark) => mark.type.name === 'mention',
            );
            if (!node.isText || !hasMention) {
              return;
            }
            try {
              const oldNode = oldState.doc.nodeAt(pos);
              const oldNodeHasMention = oldNode?.marks.some(
                (mark) => mark.type.name === 'mention',
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
                  newState.schema.marks['mention'],
                );
                modified = true;
              }
            } catch (error) {
              console.warn('mention not found');
            }
          });

          return modified ? tr : null;
        },
        state: {
          init: () => ({
            type: 'mention',
            active: false,
            keyword: '',
          }),
          apply(tr, value, oldState, newState) {
            const range = getMentionRange(newState);
            if (!range) {
              return defaultPluginState;
            }
            return {
              active: true,
              keyword: range.keyword,
            };
          },
        },
        props: {
          handleKeyDown: (view, event) => {
            return mentionPluginView?.handleKeydown?.(view, event) || false;
            // const range = getMentionRange(view.state);

            // if (!range) {
            //   return false;
            // }

            // if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            //   return extensionView.onArrowKeydown(event);
            // } else if (event.key === 'Enter') {
            //   const mentionValue = extensionView.onSubmit(event);

            //   if (!mentionValue) {
            //     return true;
            //   }

            //   view.dispatch(
            //     view.state.tr
            //       .replaceWith(
            //         range.rangeStart,
            //         range.rangeEnd,
            //         view.state.schema.text(`@${mentionValue.text}`),
            //       )
            //       .addMark(
            //         range.rangeStart,
            //         range.rangeStart + mentionValue.text.length + 1,
            //         view.state.schema.marks['mention'].create({
            //           data_id: mentionValue.dataId,
            //         }),
            //       ),
            //   );
            //   return true;
            // }

            // return false;
          },
        },
        view: (editorView) => {
          mentionPluginView =
            configs.view?.(editorView, mentionPluginKey) || null;
          // const view = new MentionView(
          //   editorView,
          //   configs,
          //   mentionPlugin,
          //   configs.view(editorView, mentionPlugin),
          // );
          // extensionView = view;
          return mentionPluginView || {};
        },
      });

    return {
      nodes: {},
      marks: {
        mention: {
          inclusive: false,
          attrs: {
            data_id: 'none',
          },
          parseDOM: [
            {
              tag: 'span',
              getAttrs: (node): MentionAttribute | boolean => {
                const dom = node as HTMLSpanElement;
                if (!dom.classList.contains('pmp-mention')) {
                  return false;
                }
                return {
                  data_id: dom.getAttribute('data-id') || '',
                };
              },
            },
            // for legacy
            {
              tag: 'a',
              getAttrs: (node): MentionAttribute | boolean => {
                const dom = node as HTMLAnchorElement;
                const data_id = dom.dataset['mentionId'];
                if (!data_id) {
                  return false;
                }
                return {
                  data_id,
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
