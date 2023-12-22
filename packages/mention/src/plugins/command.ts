import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { getMentionRange } from '../utils';

export interface MentionPluginState {
  active: boolean;
  keyword: string;
}

export interface MentionPluginView extends PluginView {
  handleKeydown?(view: EditorView, event: KeyboardEvent): boolean | void;
}

export interface EdimMentionPluginConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<MentionPluginState>,
  ) => MentionPluginView;
}

/**
 * Provides a feature to display a mention search popup when the "@" character is entered.
 */
export const edimMentionCommandPlugins = (
  configs: EdimMentionPluginConfigs,
) => {
  const defaultPluginState: MentionPluginState = {
    active: false,
    keyword: '',
  };

  const mentionPluginKey = new PluginKey<MentionPluginState>('mention');
  let mentionPluginView: MentionPluginView | null = null;

  const mentionPlugin: Plugin<MentionPluginState> =
    new Plugin<MentionPluginState>({
      key: mentionPluginKey,
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
