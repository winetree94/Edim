import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { DOMOutputSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

const getMentionRange = (
  state: EditorState,
  mentionKey: string,
): {
  keyword: string;
  rangeStart: number;
  rangeEnd: number;
} | null => {
  const before = state.tr.selection.$from.nodeBefore?.textContent || '';
  const lastIndexOfMentionKey = before.lastIndexOf(mentionKey);
  const charBeforeKeyword = before.slice(
    lastIndexOfMentionKey - 1,
    lastIndexOfMentionKey,
  );

  if (charBeforeKeyword !== KEY.SPACE && charBeforeKeyword !== KEY.EMPTY) {
    return null;
  }

  const keyword = before.slice(lastIndexOfMentionKey);
  const spaceCount = keyword.split(' ').length - 1;

  if (keyword.startsWith(mentionKey) && spaceCount <= 1) {
    return {
      keyword: before,
      rangeStart: lastIndexOfMentionKey,
      rangeEnd: state.tr.selection.$from.pos,
    };
  }

  return null;
};

const KEY = {
  SPACE: ' ',
  EMPTY: '',
};

export interface MentionState {
  type: string;
  opened: boolean;
  keyword: string;
}

const mentionDom: DOMOutputSpec = ['span', { class: 'pmp-mention' }, 0];

export class MentionView implements PluginView {
  public constructor(
    private readonly _editorView: EditorView,
    private readonly _view?: Plugin<MentionState>,
  ) {
    console.log(_editorView);
  }

  public update(view: EditorView, prevState: EditorState) {
    console.log(prevState);
    return;
  }

  public destroy(): void {
    return;
  }
}

export interface MentionPluginView {}

export interface MentionConfigs {
  schemeKey: string;
  mentionKey: string;
  view: (editorView: EditorView, plugin: Plugin<MentionState>) => PluginView;
}

export const Mention =
  (configs: MentionConfigs): PMPluginsFactory =>
  () => {
    const mentionPlugin: Plugin<MentionState> = new Plugin<MentionState>({
      key: new PluginKey('mention'),
      state: {
        init: () => ({
          type: configs.schemeKey,
          opened: false,
          keyword: '',
        }),
        apply(tr, value, oldState, newState) {
          const reset: MentionState = {
            type: configs.schemeKey,
            opened: false,
            keyword: '',
          };
          if (tr.selection.from !== tr.selection.to) {
            return reset;
          }

          const range = getMentionRange(newState, configs.mentionKey);

          if (!range) {
            return reset;
          }

          return {
            type: configs.schemeKey,
            opened: true,
            keyword: range.keyword,
          };
        },
      },
      props: {
        handleKeyDown: (view, event) => {
          if (event.key !== 'Enter') {
            return false;
          }
          // const range = getMentionRange(view.state, configs.mentionKey);
          // if (!range) {
          //   return false;
          // }
          // const node = view.state.schema.marks[configs.mentionKey].create({
          //   text: range.keyword || '',
          // });
          // const tr = view.state.tr.replaceRangeWith(
          //   range.rangeStart,
          //   range.rangeEnd,
          //   node,
          // );
          return false;
        },
      },
      view: (editorView) => {
        return configs.view(editorView, mentionPlugin);
      },
    });

    return {
      nodes: {},
      marks: {
        [configs.mentionKey]: {
          parseDOM: [{ tag: 'span' }],
          toDOM() {
            return mentionDom;
          },
        },
      },
      plugins: () => [mentionPlugin],
    };
  };
