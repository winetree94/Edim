import { Node, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { liftOutOfFreeList, wrapInFreeList } from '../transforms';

export const toggleList =
  (nodeType: NodeType): Command =>
  (state, dispatch) => {
    let tr = state.tr;
    let selection = state.selection;

    const originRange = selection.$from.blockRange(
      selection.$to,
      (node) => node.type.spec.group?.includes('block-container') || false,
    );

    if (!originRange) {
      return false;
    }

    const getRangeNodes = (doc: Node, start: number, to: number) => {
      const rangeNodes: {
        node: Node;
        pos: number;
        start: number;
        end: number;
      }[] = [];

      doc.nodesBetween(start, to, (node, pos, parent) => {
        if (parent !== originRange.parent) {
          return true;
        }
        rangeNodes.push({
          node,
          pos,
          start: Math.max(
            selection.$from.pos,
            pos + 1,
            tr.doc.nodeSize - tr.doc.content.size,
          ),
          end: Math.min(
            selection.$to.pos,
            pos + node.nodeSize - 1,
            tr.doc.content.size,
          ),
        });
        return true;
      });

      return rangeNodes;
    };

    const rangeNodes = getRangeNodes(state.doc, selection.from, selection.to);

    // if rangeNodes has no list able item, return false
    if (
      !rangeNodes.every(({ node }) =>
        ['ordered_list', 'bullet_list', 'paragraph'].includes(node.type.name),
      )
    ) {
      return false;
    }

    // if every node already target list, lift out all
    if (rangeNodes.every(({ node }) => node.type === nodeType)) {
      const tr = rangeNodes
        .slice()
        .reverse()
        .reduce((tr, { start, end }) => {
          const range = tr.doc
            .resolve(start)
            .blockRange(
              tr.doc.resolve(end),
              (node) => node.type.spec.group?.includes('list') || false,
            )!;
          return liftOutOfFreeList(tr, range)!;
        }, state.tr);
      dispatch?.(tr);
      return true;
    }

    // memoize indents
    // const indents: number[] = [];
    // rangeNodes.slice().forEach(({ node, pos, start, end }) => {
    //   const isParagraph = node.type.name === 'paragraph';
    //   if (isParagraph) {
    //     indents.push(1);
    //     return;
    //   }
    //   const range = tr.doc
    //     .resolve(start)
    //     .blockRange(
    //       tr.doc.resolve(end),
    //       (node) => node.type.spec.group?.includes('list') || false,
    //     )!;
    //   for (let i = range.startIndex; i < range.endIndex; i++) {
    //     indents.push(range.parent.child(i).attrs['indent'] as number);
    //   }
    // });

    // lifting
    tr = rangeNodes
      .slice()
      .reverse() // 좌표 영향을 주지 않기 때문에 뒤에서부터 처리
      .filter(({ node }) => node.type.name !== 'paragraph')
      .reduce((tr, { start, end }) => {
        const range = tr.doc
          .resolve(start)
          .blockRange(
            tr.doc.resolve(end),
            (node) => node.type.spec.group?.includes('list') || false,
          )!;
        return liftOutOfFreeList(tr, range) || tr;
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    const nodes = getRangeNodes(tr.doc, selection.from, selection.to);
    // remove indent attribute of paragraph
    // tr = nodes
    //   .slice()
    //   .reverse()
    //   .reduce((tr, { pos }) => tr.setNodeAttribute(pos, 'indent', 0), tr);
    // selection = state.selection.map(tr.doc, tr.mapping);

    // wrapping
    tr = nodes
      .slice()
      .reverse()
      .reduce((tr, { node, pos }) => {
        const nodePos = tr.doc.resolve(pos);
        const nodeEndPos = tr.doc.resolve(pos + node.nodeSize);
        return wrapInFreeList(nodeType)(tr, nodePos, nodeEndPos) || tr;
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    // apply memoized indents
    // const listRange = selection.$from.blockRange(
    //   selection.$to,
    //   (node) => node.type === nodeType,
    // );
    // if (listRange) {
    //   for (
    //     let pos = listRange.end,
    //       i = listRange.endIndex - 1,
    //       e = listRange.startIndex;
    //     i >= e;
    //     i--
    //   ) {
    //     pos -= listRange.parent.child(i).nodeSize;
    //     tr = tr.setNodeMarkup(pos, state.schema.nodes['list_item'], {
    //       indent: indents.pop(),
    //     });
    //   }
    // }

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection).scrollIntoView());
    return true;
  };
