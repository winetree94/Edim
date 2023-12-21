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
  edimFlatTaskListNodes,
  edimFlatTaskListItemNodes,
  edimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
    ...edimFlatTaskListNodes({
      nodeName: 'task_list',
    }),
    ...edimFlatTaskListItemNodes({
      nodeName: 'task_list_item',
    }),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimFlatTaskListPlugins({
    taskListNodeType: schema.nodes['task_list'],
    taskListItemNodeType: schema.nodes['task_list_item'],
  }),
  ...edimMenubarPlugins({
    taskList: {
      taskListNodeType: schema.nodes['task_list'],
      taskListItemNodeType: schema.nodes['task_list_item'],
    },
    align: {},
  }),
  ...edimCorePlugins(),
];

export const FlatTaskListExample = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      doc: schema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'task_list',
            content: [
              {
                type: 'task_list_item',
                attrs: {
                  indent: 1,
                  align: 'left',
                  checked: false,
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
                        text: 'asdfa',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                  checked: false,
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
                        text: 'asdfasdf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                  checked: false,
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
                        text: 'asdfasdf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 1,
                  align: 'left',
                  checked: true,
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
                        text: 'asdfasdfasdf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 1,
                  align: 'left',
                  checked: true,
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
                        text: 'asdfas',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                  checked: false,
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
                        text: 'fdasdf',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'task_list_item',
                attrs: {
                  indent: 2,
                  align: 'left',
                  checked: false,
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
                        text: 'asdfasdf',
                      },
                    ],
                  },
                ],
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
