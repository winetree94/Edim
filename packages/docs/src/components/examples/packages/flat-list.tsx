import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState, Plugin } from 'prosemirror-state';
import React, { useState } from 'react';
import { Schema } from 'prosemirror-model';
import { edimBaseNodes, edimCorePlugins, mac } from '@edim-editor/core';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import { edimHeadingNodes, edimHeadingPlugins } from '@edim-editor/heading';
import { edimMenubarPlugins } from '@edim-editor/menubar';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes({
      allowAlign: true,
      nodeName: 'paragraph',
    }),
    ...edimHeadingNodes({
      nodeName: 'heading',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes.paragraph,
    shortcutKey: mac ? 'Alt-Meta-º' : 'Ctrl-Alt-0',
  }),
  ...edimHeadingPlugins({
    nodeType: schema.nodes.heading,
  }),
  ...edimMenubarPlugins({
    textType: {
      headingNodeType: schema.nodes.heading,
      paragraphNodeType: schema.nodes.paragraph,
    },
    align: {},
  }),
  ...edimCorePlugins(),
];

export const FlatListExample = (props: ProseMirrorProps) => {
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
