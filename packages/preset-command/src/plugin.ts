import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface CommandExtensionConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<CommandPluginState>,
  ) => PluginView;
}

export interface CommandPluginView extends PluginView {
  handleKeydown?(view: EditorView, event: KeyboardEvent): boolean | void;
}

export interface CommandPluginState {
  active: boolean;
  keyword: string;
}

const DefaultCommandPluginState: CommandPluginState = {
  active: false,
  keyword: '',
};

export const createEdimCommandPlugins = (config: CommandExtensionConfigs) => {
  const commandPluginKey = new PluginKey<CommandPluginState>('commandPlugin');
  let pluginView: CommandPluginView | null = null;
  return [
    new Plugin<CommandPluginState>({
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
