import { Plugin as PMPlugin, PluginKey } from 'prosemirror-state';

export interface EdimOverlayPluginState {
  overlayElement: HTMLDivElement;
}

export interface EdimOverlayPluginConfigs {
  key?: PluginKey<EdimOverlayPluginState>;
}

const DEFAULT_CONFIGS: Required<EdimOverlayPluginConfigs> = {
  key: new PluginKey('EdimOverlayPluginKey'),
};

export const edimOverlayPlugins = (
  configs?: EdimOverlayPluginConfigs,
): PMPlugin[] => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const overlay = document.createElement('div');
  overlay.classList.add('edim-overlay-container');

  const plugin: PMPlugin<EdimOverlayPluginState> =
    new PMPlugin<EdimOverlayPluginState>({
      key: mergedConfigs.key,
      view: (view) => {
        view.dom.parentElement?.appendChild(overlay);
        return {};
      },
      state: {
        init: () => {
          return {
            overlayElement: overlay,
          };
        },
        apply: (tr, prev) => {
          return prev;
        },
      },
    });
  return [plugin];
};
