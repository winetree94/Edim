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
  edimFlatOrderedListNodes,
  edimFlatBulletListNodes,
  edimFlatListItemNodes,
  edimFlatListPlugins,
} from '@edim-editor/flat-list';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
    ...edimFlatOrderedListNodes({
      nodeName: 'ordered_list',
    }),
    ...edimFlatBulletListNodes({
      nodeName: 'bullet_list',
    }),
    ...edimFlatListItemNodes({
      nodeName: 'list_item',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimFlatListPlugins({
    orderedListNodeType: schema.nodes['ordered_list'],
    bulletListNodeType: schema.nodes['bullet_list'],
    listItemNodeType: schema.nodes['list_item'],
  }),
  ...edimMenubarPlugins({
    list: {
      orderedListNodeType: schema.nodes['ordered_list'],
      bulletListNodeType: schema.nodes['bullet_list'],
      listItemNodeType: schema.nodes['list_item'],
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
            attrs: {
              align: 'left',
            },
            content: [
              {
                type: 'text',
                text: 'This is a minimal example of a ProseMirror editor with a few plugins.',
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
            },
          },
          {
            type: 'ordered_list',
            content: [
              {
                type: 'list_item',
                attrs: {
                  indent: 1,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'alsdkfj',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'asdflaskdjf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 3,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'aklsdjf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 4,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'asldkfj',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'bullet_list',
            content: [
              {
                type: 'list_item',
                attrs: {
                  indent: 1,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'alksdjf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 3,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'aslkdfj',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'laksdjfalskdjf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 4,
                  align: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'alsdkjfaslkdfj',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
            },
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
