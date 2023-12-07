import React, { useRef, useState } from 'react';
import { ProseMirror, ProseMirrorRef } from './prose-mirror';
import { EditorState } from 'prosemirror-state';
import {
  maximumPlugins,
  maximumSchema,
} from '@site/src/components/editor/schemas/maximum';

export const Edim = () => {
  const editorRef = useRef<ProseMirrorRef>(null);

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.create({
      schema: maximumSchema,
      plugins: maximumPlugins,
    }),
  );

  return (
    <ProseMirror
      ref={editorRef}
      state={editorState}
      attributes={{ spellCheck: 'false' }}
      onStateChange={(state) => setEditorState(state)}
    ></ProseMirror>
  );
};
