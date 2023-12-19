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
