import React, { useState } from 'react';
import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import { edimPresetSchema, edimPresetPlugins } from '@edim-editor/preset';
import { edimMenubarPlugins } from '@edim-editor/menubar';

const schema = edimPresetSchema();
const plugins = edimPresetPlugins({
  schema,
  menubar: null,
});

plugins.push(
  ...edimMenubarPlugins({
    textType: {
      paragraphNodeType: schema.nodes['paragraph'],
      headingNodeType: schema.nodes['heading'],
    },
    fontFamily: {
      fontFamilyMarkType: schema.marks['font_family'],
    },
    textStyles: {
      boldMarkType: schema.marks['bold'],
      italicMarkType: schema.marks['italic'],
      underlineMarkType: schema.marks['underline'],
      strikethroughMarkType: schema.marks['strikethrough'],
      codeMarkType: schema.marks['code'],
      subscriptMarkType: schema.marks['subscript'],
      superscriptMarkType: schema.marks['superscript'],
      useClearButton: true,
    },
    textColor: {
      textColorMarkType: schema.marks['text_color'],
    },
    align: {},
    list: {
      orderedListNodeType: schema.nodes['ordered_list'],
      bulletListNodeType: schema.nodes['bullet_list'],
      listItemNodeType: schema.nodes['list_item'],
    },
    taskList: {
      taskListNodeType: schema.nodes['task_list'],
      taskListItemNodeType: schema.nodes['task_list_item'],
    },
    blockquote: {
      blockQuoteNodeType: schema.nodes['blockquote'],
    },
    codeblock: {
      codeBlockNodeType: schema.nodes['code_block'],
    },
    table: {
      tableNodeType: schema.nodes['table'],
    },
    link: {
      linkMarkType: schema.marks['link'],
    },
  }),
);

export const MenubarExample = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
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
