import { MarkType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import {
  EdimMentionCommandPluginConfigs,
  edimMentionCommandPlugins,
} from './command';
import { edimMentionUnsetPlugins } from './unset';
import { EdimMentionView } from '../views';

export interface EdimMentionPluginConfigs {
  markType: MarkType;
  commandView?: EdimMentionCommandPluginConfigs['view'];
}

const DEFAULT_CONFIGS: Required<Omit<EdimMentionPluginConfigs, 'markType'>> = {
  commandView: (view, plugin) => {
    return new EdimMentionView(view, plugin, (keyword) => [
      {
        icon: '',
        id: '1',
        name: 'Mention Command View Not Provided',
      },
    ]);
  },
};

export const edimMentionPlugins = (
  configs: EdimMentionPluginConfigs,
): PMPlugin[] => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  return [
    ...edimMentionCommandPlugins({
      view: mergedConfigs.commandView,
    }),
    ...edimMentionUnsetPlugins(),
  ];
};
