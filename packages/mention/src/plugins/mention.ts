import { MarkType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { EdimMentionPluginConfigs, edimMentionCommandPlugins } from './command';
import { edimMentionUnsetPlugins } from './unset';
import { EdimMentionView } from '../views';

export interface EdimMEntionPluginConfigs {
  markType: MarkType;
  commandView?: EdimMentionPluginConfigs['view'];
}

const DEFAULT_CONFIGS: Required<Omit<EdimMEntionPluginConfigs, 'markType'>> = {
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
  configs: EdimMEntionPluginConfigs,
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
