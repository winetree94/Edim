import { Plugin as PMPlugin, PluginKey } from 'prosemirror-state';

export const EdimOverlayPluginKey = new PluginKey('EdimOverlayPluginKey');

export interface EdimOverlayPluginState {}

export interface EdimOverlayPluginConfigs {
  key?: PluginKey<EdimOverlayPluginState>;
}

export const edimOverlayPlugins = (
  configs?: EdimOverlayPluginConfigs,
): PMPlugin[] => {
  const plugin: PMPlugin<EdimOverlayPluginState> =
    new PMPlugin<EdimOverlayPluginState>({
      key: EdimOverlayPluginKey,
      view: () => {
        return {};
      },
      state: {
        init: () => {
          return {};
        },
        apply: (tr, prev) => {
          return prev;
        },
      },
    });
  return [plugin];
};
