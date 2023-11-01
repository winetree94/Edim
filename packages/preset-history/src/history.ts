import { history, redo, undo } from 'prosemirror-history';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

export interface CreatePmpHistoryPluginConfigs {}

export const createPmpHistoryPlugins = (
  configs: CreatePmpHistoryPluginConfigs,
): Plugin[] => {
  return [
    history(),
    keymap({
      'Mod-z': undo,
      'Shift-Mod-z': redo,
    }),
  ];
};

export const HistoryExtension = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {},
    plugins: () => createPmpHistoryPlugins({}),
  };
};
