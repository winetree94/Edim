import { Node, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { liftOut, liftOutOfFreeList, wrapInFreeList } from '../transforms';
import { getBlockContainerChildren } from 'prosemirror-preset-utils';

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
    const indents: number[] = [];
    rangeNodes.slice().forEach(({ node, start, end }) => {
      const isParagraph = node.type.name === 'paragraph';
      if (isParagraph) {
        indents.push(1);
        return;
      }
      const range = tr.doc
        .resolve(start)
        .blockRange(
          tr.doc.resolve(end),
          (node) => node.type.spec.group?.includes('list') || false,
        )!;
      for (let i = range.startIndex; i < range.endIndex; i++) {
        indents.push(range.parent.child(i).attrs['indent'] as number);
      }
    });

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

    // remove indent attribute of paragraph
    tr = getRangeNodes(tr.doc, selection.from, selection.to)
      .slice()
      .reverse()
      .reduce((tr, { pos }) => tr.setNodeAttribute(pos, 'indent', 0), tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    // wrapping
    tr = wrapInFreeList(nodeType)(tr, selection.$from, selection.$to) || tr;
    selection = state.selection.map(tr.doc, tr.mapping);

    // apply memoized indents
    const listRange = selection.$from.blockRange(
      selection.$to,
      (node) => node.type === nodeType,
    );
    if (listRange) {
      for (
        let pos = listRange.end,
          i = listRange.endIndex - 1,
          e = listRange.startIndex;
        i >= e;
        i--
      ) {
        pos -= listRange.parent.child(i).nodeSize;
        tr = tr.setNodeMarkup(pos, state.schema.nodes['list_item'], {
          indent: indents.pop(),
        });
      }
    }

    // merge with adjacent list
    const range = selection.$from.blockRange(
      selection.$to,
      (node) => node.type.spec.group?.includes('block-container') || false,
    )!;
    const adjacentsNodes: {
      node: Node;
      pos: number;
    }[] = [];
    tr.doc.nodesBetween(
      Math.max(range.start - 2, 0),
      Math.min(range.end + 2, tr.doc.nodeSize - 2),
      (node, pos) => {
        if (node.type !== nodeType) {
          return true;
        }
        adjacentsNodes.push({
          node,
          pos,
        });
        return true;
      },
    );
    tr = adjacentsNodes
      .slice()
      .reverse()
      .reduce((tr, { pos }, index, self) => {
        if (index === self.length - 1) {
          return tr;
        }
        return tr.delete(pos - 1, pos + 1);
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    dispatch?.(tr.setSelection(selection).scrollIntoView());
    return true;
  };

export const toggleList2 =
  (nodeType: NodeType): Command =>
  (state, dispatch) => {
    let tr = state.tr;
    let selection = state.selection;

    const nodes = getBlockContainerChildren(
      tr.doc,
      selection.from,
      selection.to,
    );

    if (nodes.every(({ node }) => node.type === nodeType)) {
      tr = liftOut(tr, state, selection.from, selection.to).tr;
      selection = selection.map(tr.doc, tr.mapping);
      dispatch?.(tr.setSelection(selection));
      return true;
    }

    const liftOutResult = liftOut(tr, state, selection.from, selection.to);
    const indents = liftOutResult.indents.reverse();
    tr = liftOutResult.tr;
    selection = selection.map(tr.doc, tr.mapping);
    const renode = getBlockContainerChildren(
      tr.doc,
      selection.from,
      selection.to,
    );

    tr = renode
      .slice()
      .reverse()
      .reduce((tr, { node, pos }, index) => {
        const $from = tr.doc.resolve(pos);
        const $to = tr.doc.resolve(pos + node.nodeSize);
        tr = tr.wrap($from.blockRange($to)!, [
          {
            type: nodeType,
            attrs: null,
          },
          {
            type: state.schema.nodes['list_item'],
            attrs: { indent: indents[index] },
          },
        ]);
        return tr;
      }, tr);
    selection = selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection));
    return true;
  };
