import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface EdimCommandPluginConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<EdimCommandPluginState>,
  ) => PluginView;
}

export interface EdimCommandPluginView extends PluginView {
  handleKeydown?(view: EditorView, event: KeyboardEvent): boolean | void;
}

export interface EdimCommandPluginState {
  active: boolean;
  keyword: string;
}

const DefaultCommandPluginState: EdimCommandPluginState = {
  active: false,
  keyword: '',
};

export const edimCommandPlugins = (config: EdimCommandPluginConfigs) => {
  const commandPluginKey = new PluginKey<EdimCommandPluginState>(
    'commandPlugin',
  );
  let pluginView: EdimCommandPluginView | null = null;
  return [
    new Plugin<EdimCommandPluginState>({
      key: commandPluginKey,
      view: (editorView) => {
        pluginView = config.view?.(editorView, commandPluginKey) || {};
        return pluginView;
      },
      props: {
        handleKeyDown: (view, event) => {
          return pluginView?.handleKeydown?.(view, event) || false;
        },
      },
      state: {
        init: () => {
          return {
            active: false,
            keyword: '',
          };
        },
        apply: (tr, pluginState, state) => {
          if (tr.selection.$from.parent !== tr.selection.$to.parent) {
            return DefaultCommandPluginState;
          }

          if (!tr.selection.$from.parent.isTextblock) {
            return DefaultCommandPluginState;
          }

          const text = tr.selection.$from.parent.textContent;
          if (!text.startsWith('/') || text.includes(' ')) {
            return DefaultCommandPluginState;
          }

          return {
            active: true,
            keyword: text.slice(1),
          };
        },
      },
    }),
  ];
};
