import { EditorState, Transaction } from 'prosemirror-state';
import { liftTarget } from 'prosemirror-transform';
import { getBlockContainerChildren } from '../utils';
import { NodePair } from '../types';

export interface LiftOutResult {
  tr: Transaction;
  indents: number[];
}

export const liftOut = (
  tr: Transaction,
  state: EditorState,
  from: number,
  to: number,
): LiftOutResult => {
  const nodes = getBlockContainerChildren(tr.doc, from, to);
  const indents: number[] = [];
  tr = nodes
    .slice()
    .reverse()
    .reduce((tr, { node, pos }) => {
      if (node.type.spec.code) {
        const paragraphs = node.textContent.split('\n');
        tr = tr.delete(pos, pos + node.nodeSize);
        return paragraphs
          .slice()
          .reverse()
          .reduce((tr, text) => {
            tr = tr.insert(
              pos,
              state.schema.nodes['paragraph'].create(
                {},
                text ? state.schema.text(text) : null,
              ),
            );
            indents.push(1);
            return tr;
          }, tr);
      } else if (node.type.name !== 'paragraph') {
        const paragraphs: NodePair[] = [];
        tr.doc.nodesBetween(
          Math.max(pos, from),
          Math.min(pos + node.nodeSize, to),
          (node, pos, parent) => {
            if (node.type.name === 'paragraph') {
              paragraphs.push({ node, pos, parent });
            }
            return true;
          },
        );
        tr = paragraphs
          .slice()
          .reverse()
          .reduce((tr, { node, pos }) => {
            const from$ = tr.doc.resolve(pos);
            const to$ = tr.doc.resolve(pos + node.nodeSize);
            const range = from$.blockRange(to$);
            const indent = range?.parent?.attrs['indent'] ?? 1;
            const target = range && liftTarget(range);
            if (range && target !== null) {
              indents.push(Number(indent));
              return tr.lift(range, target);
            }
            return tr;
          }, tr);
      } else {
        indents.push(1);
      }
      return tr;
    }, tr);

  return {
    tr,
    indents: indents.reverse(),
  };
};
