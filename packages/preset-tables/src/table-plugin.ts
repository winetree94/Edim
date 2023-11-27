import { NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { columnResizing, tableEditing, tableNodes } from 'prosemirror-tables';

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
          if (value)
            attrs['style'] =
              (attrs['style'] || '') + `background-color: ${value};`;
        },
      },
    },
  }),
};

export interface TableConfigs {
}

export interface CreatePmpTablePluginConfigs {

}

export const createPmpTablePlugins = (
  configs: CreatePmpTablePluginConfigs,
): Plugin[] => {
  return [
    columnResizing(),
    tableEditing(),
  ];
}
