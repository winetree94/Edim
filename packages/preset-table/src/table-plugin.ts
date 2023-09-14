import { NodeSpec } from 'prosemirror-model';
import { columnResizing, goToNextCell, tableEditing, tableNodes } from '.';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';

const tables: Record<string, NodeSpec> = {
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
  resizing?: boolean;
}

export const Table = (configs?: TableConfigs): PMPluginsFactory => {
  return () => {
    return {
      nodes: {
        ...tables,
      },
      marks: {},
      plugins: () => [
        ...(configs?.resizing ? [columnResizing()] : []),
        tableEditing(),
        keymap({
          Tab: goToNextCell(1),
          'Shift-Tab': goToNextCell(-1),
        }),
      ],
    };
  };
};
