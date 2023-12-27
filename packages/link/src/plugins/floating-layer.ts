import { Plugin as PMPlugin } from 'prosemirror-state';

export const edimLinkFloatingLayerPlugins = (): PMPlugin[] => {
  const plugin = new PMPlugin({
    view: (editorView) => {
      return {
        update: (view, prevState) => {},
      };
    },
  });
  return [plugin];
};
