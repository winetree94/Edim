import React from 'react';
import { classes } from '@edim-editor/ui';
import { EditorView } from 'prosemirror-view';
import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';

export interface ProseMirrorProps {
  className?: string;
  state: EditorState;
  style?: React.CSSProperties;
  onStateChange?: (doc: any) => void;
}

export const ProseMirror = (props: ProseMirrorProps) => {
  const editorDomRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    const view = new EditorView(editorDomRef.current, {
      state: props.state,
      ...props,
      attributes: {
        spellcheck: 'false',
      },
    });
    editorViewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div
      ref={editorDomRef}
      className={classes('edim-root', props.className)}
      style={props.style}
    ></div>
  );
};
