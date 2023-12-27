import { Plugin as PMPlugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { getMentionRange } from '../utils';

export interface MentionPluginState {
  active: boolean;
  keyword: string;
  start: number;
  end: number;
}

export interface MentionPluginView extends PluginView {
  handleKeydown?(view: EditorView, event: KeyboardEvent): boolean | void;
}

export interface EdimMentionCommandPluginConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<MentionPluginState>,
  ) => MentionPluginView;
}

/**
 * Provides a feature to display a mention search popup when the "@" character is entered.
 */
export const edimMentionCommandPlugins = (
  configs: EdimMentionCommandPluginConfigs,
): PMPlugin[] => {
  const defaultPluginState: MentionPluginState = {
    active: false,
    keyword: '',
    start: 0,
    end: 0,
  };

  const mentionPluginKey = new PluginKey<MentionPluginState>('mention');
  let mentionPluginView: MentionPluginView | null = null;

  const mentionPlugin: PMPlugin<MentionPluginState> =
    new PMPlugin<MentionPluginState>({
      key: mentionPluginKey,
      state: {
        init: () => ({
          type: 'mention',
          active: false,
          keyword: '',
          start: 0,
          end: 0,
        }),
        apply(tr, value, oldState, newState) {
          const range = getMentionRange(newState);
          if (!range) {
            return defaultPluginState;
          }
          return {
            active: true,
            keyword: range.keyword,
            start: range.rangeStart,
            end: range.rangeEnd,
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
