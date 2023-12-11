import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
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
  view?: (
    view: EditorView,
    plugin: PluginKey<MentionPluginState>,
  ) => MentionPluginView;
}

export const EDIM_MENTION_MARK: Record<string, MarkSpec> = {
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
          if (!dom.classList.contains('edim-mention')) {
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
          class: 'edim-mention',
          'data-id': attrs.data_id,
        },
        0,
      ];
    },
  } as MarkSpec,
};

export interface createEdimMentionPluginConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<MentionPluginState>,
  ) => MentionPluginView;
}

export const createEdimMentionPlugins = (
  configs: createEdimMentionPluginConfigs,
) => {
  const defaultPluginState: MentionPluginState = {
    active: false,
    keyword: '',
  };

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
        },
      },
      view: (editorView) => {
        mentionPluginView =
          configs.view?.(editorView, mentionPluginKey) || null;
        return mentionPluginView || {};
      },
    });

  return [mentionPlugin];
};
