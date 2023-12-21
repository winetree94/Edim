/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState, Plugin } from 'prosemirror-state';
import React, { useState } from 'react';
import { Schema } from 'prosemirror-model';
import { edimBaseNodes, edimCorePlugins } from '@edim-editor/core';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import {
  edimHeadingInputRulePlugins,
  edimHeadingKeymapPlugins,
  edimHeadingNodes,
  edimHeadingPlugins,
} from '@edim-editor/heading';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
    ...edimHeadingNodes({
      nodeName: 'heading',
      allowAlign: true,
      levels: [2, 4, 6],
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimHeadingPlugins({
    nodeType: schema.nodes['heading'],
  }),
  // ...edimHeadingKeymapPlugins({
  //   nodeType: schema.nodes['heading'],
  //   level: 6,
  // }),
  // ...edimHeadingInputRulePlugins({
  //   nodeType: schema.nodes['heading'],
  //   level: 6,
  // }),
  ...edimMenubarPlugins({
    textType: {
      headingNodeType: schema.nodes['heading'],
      paragraphNodeType: schema.nodes['paragraph'],
    },
    align: {},
  }),
  ...edimCorePlugins(),
];

export const HeadingExample = (props: ProseMirrorProps) => {
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
