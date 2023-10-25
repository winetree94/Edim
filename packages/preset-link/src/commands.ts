import { EditorState, Transaction } from 'prosemirror-state';

export const canAddLink = (state: EditorState): boolean => {
  const { $from, $to } = state.selection;

  if ($from.parent !== $to.parent) {
    return false;
  }

  if (!$from.parent.isTextblock) {
    return false;
  }

  return true;
};

export const addLink = (
  tr: Transaction,
  from: number,
  to: number,
  text: string,
  link: string,
) => {
  if (from === to) {
    const alternativeText = text || link;
    return tr
      .insertText(alternativeText, from, to)
      .addMark(
        from,
        to + alternativeText.length,
        tr.doc.type.schema.marks['link'].create({
          href: link,
        }),
      )
      .scrollIntoView();
  }

  return tr
    .delete(from, to)
    .insertText(text, from)
    .addMark(
      from,
      from + text.length,
      tr.doc.type.schema.marks['link'].create({
        href: link,
      }),
    )
    .scrollIntoView();
};
