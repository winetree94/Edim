import { NodeSpec } from 'prosemirror-model';
import { columnResizing, goToNextCell, tableEditing, tableNodes } from '.';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

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
    keymap({
      Tab: goToNextCell(1),
      'Shift-Tab': goToNextCell(-1),
    }),
  ];
}

export const Table = (configs?: TableConfigs): PMPluginsFactory => {
  return () => {
    return {
      nodes: {
        ...PMP_TABLE_NODES,
      },
      marks: {},
      plugins: () => createPmpTablePlugins({}),
    };
  };
};
