import { NodeSpec } from 'prosemirror-model';
import { tableNodes } from 'prosemirror-tables';

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
