import { Plugin as PMPlugin, TextSelection } from 'prosemirror-state';

export const edimResetMarkPlugins = (): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    new PMPlugin({
      appendTransaction: (transactions, oldState, newState) => {
        if (!transactions.some((tr) => tr.docChanged)) {
          return;
        }

        if (!(newState.selection instanceof TextSelection)) {
          return;
        }

        const { $cursor } = newState.selection;
        if (!$cursor || !newState.storedMarks) {
          return;
        }

        return newState.tr.setStoredMarks([]);
      },
    }),
  ];

  return plugins;
};
