import { Plugin as PMPlugin } from 'prosemirror-state';
import { isInMarks, isTextSelection } from '@edim-editor/core';
import { MarkType } from 'prosemirror-model';
import { findParentNode } from 'prosemirror-utils';

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
        if (!isTextSelection(newState.selection) || !newState.selection.empty) {
          return DEFAULT_STATE;
        }
        const marks = newState.selection.$head.marks();
        if (!isInMarks(marks, configs.markType)) {
          return DEFAULT_STATE;
        }
        return {
          active: true,
        };
      },
    },
  });
  return [plugin];
};
