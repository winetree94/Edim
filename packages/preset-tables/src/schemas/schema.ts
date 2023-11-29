import { NodeSpec } from 'prosemirror-model';
import { TableRole, tableNodes } from 'prosemirror-tables';

export interface TableNodeSpec extends NodeSpec {
  tableRole: TableRole;
}

export interface CellAttributes {
  colspan: number;
  rowspan: number;
  colwidth: number[];
  background: string | null;
}

export const PMP_TABLE_NODES: Record<string, NodeSpec> = {
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom) {
          return dom.style.backgroundColor || null;
        },
        setDOMAttr(value, attrs) {
          if (value) {
            attrs['style'] =
              (attrs['style'] || '') + `background-color: ${value};`;
          }
        },
      },
    },
  }),
};
