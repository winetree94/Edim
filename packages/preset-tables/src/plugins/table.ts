import { Plugin as EDIMlugin } from 'prosemirror-state';

export interface EdimTableEditingPluginConfigs {

}

const DEFAULT_EDIM_TABLE_EDITING_PLUGIN_CONFIGS: EdimTableEditingPluginConfigs = {
  
};

export const createEdimTablePlugins = (
  configs?: EdimTableEditingPluginConfigs,
) => {
  const mergedConfigs = {
    ...DEFAULT_EDIM_TABLE_EDITING_PLUGIN_CONFIGS,
    ...configs,
  };

  return [
    new EDIMlugin({

    }),
  ];
}