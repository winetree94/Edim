import { Plugin as PMPlugin } from 'prosemirror-state';

export interface PmpTableEditingPluginConfigs {

}

const DEFAULT_PMP_TABLE_EDITING_PLUGIN_CONFIGS: PmpTableEditingPluginConfigs = {
  
};

export const createPmpTablePlugins = (
  configs?: PmpTableEditingPluginConfigs,
) => {
  const mergedConfigs = {
    ...DEFAULT_PMP_TABLE_EDITING_PLUGIN_CONFIGS,
    ...configs,
  };

  return [
    new PMPlugin({

    }),
  ];
}