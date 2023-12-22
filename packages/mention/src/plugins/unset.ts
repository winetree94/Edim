import { Plugin as PMPlugin } from 'prosemirror-state';

/**
 * Provides a feature to unmention when text with mention formatting is partially deleted.
 */
export const edimMentionUnsetPlugins = () => {
  const mentionPlugin = new PMPlugin({
    appendTransaction: (transactions, oldState, newState) => {
      const tr = newState.tr;
      let modified = false;

      if (!transactions.some((transaction) => transaction.docChanged)) {
        return;
      }

      newState.doc.descendants((node, pos) => {
        const hasMention = node.marks.some(
          (mark) => mark.type.name === 'mention',
        );
        if (!node.isText || !hasMention) {
          return;
        }
        try {
          const oldNode = oldState.doc.nodeAt(pos);
          const oldNodeHasMention = oldNode?.marks.some(
            (mark) => mark.type.name === 'mention',
          );

          if (
            oldNode &&
            oldNodeHasMention &&
            oldNode.isText &&
            node.text !== oldNode.text
          ) {
            tr.removeMark(
              pos,
              pos + node.nodeSize,
              newState.schema.marks['mention'],
            );
            modified = true;
          }
        } catch (error) {
          console.warn('mention not found');
        }
      });

      return modified ? tr : null;
    },
  });

  return [mentionPlugin];
};
