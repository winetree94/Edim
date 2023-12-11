import React from 'react';
import { classes } from '@edim-editor/ui';
import { EditorView } from 'prosemirror-view';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EditorState } from 'prosemirror-state';

export interface ProseMirrorRef {
  view: EditorView;
}
export interface ProseMirrorProps {
  className?: string;
  state: EditorState;
  style?: React.CSSProperties;
  onStateChange?: (doc: any) => void;
}

export const ProseMirror = forwardRef<ProseMirrorRef, ProseMirrorProps>(
  (props, ref) => {
    const editorDomRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    useImperativeHandle(ref, () => ({
      get view() {
        return editorViewRef.current;
      },
    }));

    useEffect(() => {
      const view = new EditorView(editorDomRef.current, {
        state: props.state,
        ...props,
      });
      editorViewRef.current = view;
      return () => {
        view.destroy();
      };
    }, []);

    return (
      <div
        ref={editorDomRef}
        className={classes('edim-root')}
        style={props.style}
      ></div>
    );
  },
);
