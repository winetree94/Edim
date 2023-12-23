import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { isInCodeBlock } from '../utils';

export interface EdimCodeBlockEjectPluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockEjectPlugins = (
  configs: EdimCodeBlockEjectPluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    new PMPlugin({
      props: {
        handleKeyDown: (view, event) => {
          if (!['ArrowRight', 'ArrowDown'].includes(event.key)) {
            return;
          }
          const codeblock = isInCodeBlock(view.state, configs.nodeType);
          if (!isInCodeBlock) {
            return;
          }
          return false;
        },
      },
    }),
  ];

  return plugins;
};
