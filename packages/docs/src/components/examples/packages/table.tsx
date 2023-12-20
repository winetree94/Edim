import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState, Plugin } from 'prosemirror-state';
import React, { useState } from 'react';
import { Schema } from 'prosemirror-model';
import { edimBaseNodes, edimCorePlugins } from '@edim-editor/core';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import {
  edimTableEditingPlugins,
  edimTableNodes,
  edimTablePlugins,
} from '@edim-editor/tables';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
    ...edimTableNodes({
      tableNodeName: 'table',
      tableRowNodeName: 'table_row',
      tableCellNodeName: 'table_cell',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes.paragraph,
  }),
  ...edimTablePlugins({
    tableNodeType: schema.nodes.table,
    tableRowNodeType: schema.nodes.table_row,
    tableCellNodeType: schema.nodes.table_cell,
  }),
  ...edimTableEditingPlugins({
    tableNodeType: schema.nodes.table,
    tableRowNodeType: schema.nodes.table_row,
    tableCellNodeType: schema.nodes.table_cell,
  }),
  ...edimMenubarPlugins({
    table: {
      tableNodeType: schema.nodes.table,
    },
  }),
  ...edimCorePlugins(),
];

export const TableExample = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      doc: schema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is a minimal example of a ProseMirror editor with a few plugins.',
              },
            ],
          },
        ],
      }),
      schema: schema,
      plugins: plugins,
    }),
  );

  return (
    <ProseMirror
      state={state}
      style={{ height: '300px' }}
      className="border"
      {...props}
    />
  );
};
