import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimLinkFloatingLayerPlugins } from './floating-layer';
import { MarkType } from 'prosemirror-model';

export interface EdimLinkPluginConfigs {
  markType: MarkType;
}

export const edimLinkPlugins = (configs: EdimLinkPluginConfigs): PMPlugin[] => {
  return [...edimLinkFloatingLayerPlugins(configs)];
};
