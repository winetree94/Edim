import { EditorState } from 'prosemirror-state';

export const KEYBOARD_KEY = {
  SPACE: ' ',
  EMPTY: '',
} as const;

export const getMentionRange = (
  state: EditorState,
): {
  keyword: string;
  rangeStart: number;
  rangeEnd: number;
} | null => {
  if (state.selection.from !== state.selection.to) {
    return null;
  }

  const previousHasMention = state.doc
    .resolve(Math.max(state.tr.selection.$from.pos - 1, 0))
    .marks()
    .some((mark) => mark.type.name === 'mention');

  const currentHasMention = state.tr.selection.$from
    .marks()
    .some((mark) => mark.type.name === 'mention');

  if (previousHasMention || currentHasMention) {
    return null;
  }

  const before = state.tr.selection.$from.nodeBefore?.textContent || '';
  const lastIndexOfMentionKey = before.lastIndexOf('@');

  const charBeforeKeyword = before.slice(
    lastIndexOfMentionKey - 1,
    lastIndexOfMentionKey,
  );

  if (
    charBeforeKeyword !== KEYBOARD_KEY.SPACE &&
    charBeforeKeyword !== KEYBOARD_KEY.EMPTY
  ) {
    return null;
  }

  const keyword = before.slice(lastIndexOfMentionKey);
  const blankCount = keyword.split(' ').length - 1;

  if (keyword.startsWith('@') && blankCount <= 1) {
    return {
      keyword: keyword.slice(1),
      rangeStart: state.tr.selection.from - keyword.length,
      rangeEnd: state.tr.selection.from,
    };
  }

  return null;
};
