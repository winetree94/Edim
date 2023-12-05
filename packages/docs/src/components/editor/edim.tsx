import React, { useRef, useState } from 'react';
import { ProseMirror, ProseMirrorRef } from './prose-mirror';
import { EditorState } from 'prosemirror-state';
import {
  maximumPlugins,
  maximumSchema,
} from '@site/src/components/editor/schemas/maximum';
import BrowserOnly from '@docusaurus/BrowserOnly';

export const Edim = () => {
  const editorRef = useRef<ProseMirrorRef>(null);

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.create({
      schema: maximumSchema,
      plugins: maximumPlugins,
    }),
  );

  return (
    <BrowserOnly fallback={<div>loading</div>}>
      {() => {
        return (
          <ProseMirror
            ref={editorRef}
            state={editorState}
            attributes={{ spellCheck: 'false' }}
            onStateChange={(state) => setEditorState(state)}
          ></ProseMirror>
        );
      }}
    </BrowserOnly>
  );
};
