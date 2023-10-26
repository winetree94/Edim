import { PMPluginsFactory } from 'prosemirror-preset-core';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface CommandExtensionConfigs {
  view?: (
    view: EditorView,
    plugin: PluginKey<CommandPluginState>,
  ) => PluginView;
}

export interface CommandPluginState {
  active: boolean;
  keyword: string;
}

const DefaultCommandPluginState: CommandPluginState = {
  active: false,
  keyword: '',
};

export const Command = (config: CommandExtensionConfigs): PMPluginsFactory => {
  const commandPluginKey = new PluginKey<CommandPluginState>('commandPlugin');
  return () => {
    return {
      nodes: {},
      marks: {},
      plugins: () => {
        return [
          new Plugin<CommandPluginState>({
            key: commandPluginKey,
            view: (editorView) => {
              return config.view?.(editorView, commandPluginKey) || {};
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
      },
    };
  };
};
