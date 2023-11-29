import { AttributeSpec, Attrs, NodeSpec } from 'prosemirror-model';
import { MutableAttrs, TableRole, tableNodes } from 'prosemirror-tables';

export interface TableNodeSpec extends NodeSpec {
  tableRole: TableRole;
}

export interface CellAttributes {
  colspan: number;
  rowspan: number;
  colwidth: number[];
  background: string | null;
}

// export const PMP_TABLE_NODES: Record<string, NodeSpec> = {
//   ...tableNodes({
//     tableGroup: 'block',
//     cellContent: 'block+',
//     cellAttributes: {
//       background: {
//         default: null,
//         getFromDOM(dom) {
//           return dom.style.backgroundColor || null;
//         },
//         setDOMAttr(value, attrs) {
//           if (value) {
//             attrs['style'] =
//               (attrs['style'] || '') + `background-color: ${value};`;
//           }
//         },
//       },
//     },
//   }),
// };

export interface CellAttrs {
  colspan: number;
  rowspan: number;
  colwidth: number[] | null;
}

function getCellAttrs(dom: HTMLElement | string, extraAttrs: Attrs): Attrs {
  if (typeof dom === 'string') {
    return {};
  }

  const widthAttr = dom.getAttribute('data-colwidth');
  const widths =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(',').map((s) => Number(s))
      : null;
  const colspan = Number(dom.getAttribute('colspan') || 1);
  const result: MutableAttrs = {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: widths && widths.length == colspan ? widths : null,
  } satisfies CellAttrs;
  for (const prop in extraAttrs) {
    const getter = extraAttrs[prop].getFromDOM;
    const value = getter && getter(dom);
    if (value != null) {
      result[prop] = value;
    }
  }
  return result;
}

function setCellAttrs(node: Node, extraAttrs: Attrs): Attrs {
  const attrs: MutableAttrs = {};
  if (node.attrs.colspan != 1) {
    attrs.colspan = node.attrs.colspan;
  }
  if (node.attrs.rowspan != 1) {
    attrs.rowspan = node.attrs.rowspan;
  }
  if (node.attrs.colwidth) {
    attrs['data-colwidth'] = node.attrs.colwidth.join(',');
  }
  for (const prop in extraAttrs) {
    const setter = extraAttrs[prop].setDOMAttr;
    if (setter) {
      setter(node.attrs[prop], attrs);
    }
  }
  return attrs;
}

const extraAttrs = {};
const cellAttrs: Record<string, AttributeSpec> = {
  colspan: { default: 1 },
  rowspan: { default: 1 },
  colwidth: { default: null },
};
for (const prop in extraAttrs) {
  cellAttrs[prop] = { default: extraAttrs[prop].default };
}

export const PMP_TABLE_NODES = {
  table: {
    content: 'table_row+',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    parseDOM: [
      {
        tag: 'table',
      },
    ],
    toDOM() {
      return ['table', ['tbody', 0]];
    },
  },
  table_row: {
    content: '(table_cell | table_header)*',
    tableRole: 'row',
    parseDOM: [
      {
        tag: 'tr',
      },
    ],
    toDOM() {
      return ['tr', 0];
    },
  },
  table_cell: {
    content: 'block+',
    attrs: {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
      },
      background: {
        default: null,
      },
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [{ tag: 'td', getAttrs: (dom) => getCellAttrs(dom, extraAttrs) }],
    toDOM(node) {
      return ['td', setCellAttrs(node, extraAttrs), 0];
    },
  },
  table_header: {
    content: 'block+',
    attrs: {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
      },
      background: {
        default: null,
      },
    },
    tableRole: 'header_cell',
    isolating: true,
    parseDOM: [{ tag: 'th', getAttrs: (dom) => getCellAttrs(dom, extraAttrs) }],
    toDOM(node) {
      return ['th', setCellAttrs(node, extraAttrs), 0];
    },
  },
};
