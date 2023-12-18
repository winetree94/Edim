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
import {
  edimFlatOrderedListNodes,
  edimFlatBulletListNodes,
  edimFlatListItemNodes,
  edimFlatListPlugins,
} from '@edim-editor/flat-list';
import { edimMenubarPlugins } from '@edim-editor/menubar';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes({
      allowAlign: true,
      nodeName: 'paragraph',
    }),
    ...edimFlatOrderedListNodes(),
    ...edimFlatBulletListNodes(),
    ...edimFlatListItemNodes(),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes.paragraph,
    shortcutKey: mac ? 'Alt-Meta-º' : 'Ctrl-Alt-0',
  }),
  ...edimFlatListPlugins({
    bulletListNodeType: schema.nodes.bullet_list,
    orderedListNodeType: schema.nodes.ordered_list,
    listItemNodeType: schema.nodes.list_item,
  }),
  ...edimMenubarPlugins({
    list: {
      flatOrderedListNodeType: schema.nodes.ordered_list,
      flatBulletListNodeType: schema.nodes.bullet_list,
      flatListItemNodeType: schema.nodes.list_item,
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
