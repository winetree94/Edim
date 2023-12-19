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
  edimBlockQuotePlugins,
  edimBlockquoteNodes,
} from '@edim-editor/blockquote';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
    ...edimBlockquoteNodes({
      multiline: true,
      nodeName: 'blockquote',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimBlockQuotePlugins({
    nodeType: schema.nodes['blockquote'],
    mergeAdjacentBlockquote: true,
  }),
  ...edimMenubarPlugins({
    blockquote: {
      blockQuoteNodeType: schema.nodes['blockquote'],
    },
    align: {},
  }),
  ...edimCorePlugins(),
];

export const BlockquoteExample = (props: ProseMirrorProps) => {
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
