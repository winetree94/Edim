import { Plugin as PMPlugin } from 'prosemirror-state';

export interface EdimTablePluginConfigs {}

const DEFAULT_EDIM_TABLE_EDITING_PLUGIN_CONFIGS: EdimTablePluginConfigs = {};

export const edimTablePlugins = (configs?: EdimTablePluginConfigs) => {
  const mergedConfigs = {
    ...DEFAULT_EDIM_TABLE_EDITING_PLUGIN_CONFIGS,
    ...configs,
  };

  return [new PMPlugin({})];
};
