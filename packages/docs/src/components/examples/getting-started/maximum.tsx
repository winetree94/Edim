import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import React, { useState } from 'react';
import { edimPresetSchema, edimPresetPlugins } from '@edim-editor/preset';
import doc from '@site/src/pages/lorem-ipsum.json';
import { Node } from 'prosemirror-model';

const schema = edimPresetSchema();
const plugins = edimPresetPlugins({
  schema,
});

export const Maximum = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      doc: Node.fromJSON(schema, doc),
      schema: schema,
      plugins: plugins,
    }),
  );

  return <ProseMirror state={state} {...props} />;
};
