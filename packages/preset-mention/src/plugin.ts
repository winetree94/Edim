import { Plugin, PluginKey } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { MarkSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { getMentionRange } from './utils';
import { MentionState } from './state';
import { MentionView, MentionViewProvider } from './view';

export interface MentionAttribute {
  data_id: string;
}

export interface MentionConfigs {
  schemeKey: string;
  mentionKey: string;
  elementName?: string;
  view: (view: EditorView, plugin: Plugin<MentionState>) => MentionViewProvider;
}

export const Mention = (configs: MentionConfigs): PMPluginsFactory => {
  const defaultPluginState: MentionState = {
    actived: false,
    keyword: '',
  };

  return () => {
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
          if (event.key !== 'Enter') {
            return false;
          }

          const range = getMentionRange(
            view.state,
            configs.mentionKey,
            configs.schemeKey,
          );

          if (!range) {
            return false;
          }

          const tr = view.state.tr.addMark(
            range.rangeStart,
            range.rangeEnd,
            view.state.schema.marks[configs.schemeKey].create({
              data_id: range.keyword,
            }),
          );

          view.dispatch(tr);
          return true;
        },
      },
      view: (editorView) => {
        return new MentionView(
          editorView,
          mentionPlugin,
          configs.view(editorView, mentionPlugin),
        );
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
