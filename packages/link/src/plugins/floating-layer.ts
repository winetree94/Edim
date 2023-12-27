import { Plugin as PMPlugin } from 'prosemirror-state';
import { findMark, isTextSelection } from '@edim-editor/core';
import { MarkType } from 'prosemirror-model';

export interface EdimLinkFloatingLayerPluginState {
  active: boolean;
}

const DEFAULT_STATE: Readonly<EdimLinkFloatingLayerPluginState> = {
  active: false,
};

export interface edimLinkFloatingLayerPluginConfigs {
  markType: MarkType;
}

export const edimLinkFloatingLayerPlugins = (
  configs: edimLinkFloatingLayerPluginConfigs,
): PMPlugin[] => {
  const plugin = new PMPlugin<EdimLinkFloatingLayerPluginState>({
    view: (editorView) => {
      return {
        update: (view, prevState) => {},
      };
    },
    state: {
      init: () => ({
        active: false,
      }),
      apply: (tr, value, oldState, newState) => {
        if (!isTextSelection(newState.selection)) {
          return DEFAULT_STATE;
        }
        const link = findMark(configs.markType, { includeAdjacent: true })(
          newState,
        );
        if (!link) {
          return DEFAULT_STATE;
        }
        console.log(link);
        return {
          active: true,
        };
      },
    },
  });
  return [plugin];
};
