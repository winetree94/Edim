import { Plugin as PMPlugin } from 'prosemirror-state';

export const edimResetMarkPlugins = (): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    new PMPlugin({
      // props: {
      //   handleKeyDown: (view, event) => {
      //     if (event.key !== 'Backspace') {
      //       return false;
      //     }
      //     console.log('backspace');
      //     return false;
      //   },
      // },
    }),
  ];

  return plugins;
};
