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
import {
  edimHorizontalRuleNodes,
  edimHorizontalRulePlugins,
} from '@edim-editor/hr';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes({
      allowAlign: true,
      nodeName: 'paragraph',
    }),
    ...edimHorizontalRuleNodes({
      nodeName: 'horizontal_rule',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimHorizontalRulePlugins({
    nodeType: schema.nodes['horizontal_rule'],
  }),
  ...edimCorePlugins(),
];

export const HorizontalRuleExample = (props: ProseMirrorProps) => {
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
