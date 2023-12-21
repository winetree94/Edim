import { Plugin as PMPlugin, TextSelection } from 'prosemirror-state';

/**
 * Remove the StoredMark when the text corresponding to the Mark range is deleted.
 */
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
