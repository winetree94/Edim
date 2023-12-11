import React from 'react';
import { classes } from 'prosemirror-preset-ui';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface ProseMirrorRef {
  view: EditorView;
}
export interface ProseMirrorProps extends DirectEditorProps {
  className?: string;
  onStateChange?: (doc: any) => void;
}

export const ProseMirror = forwardRef<ProseMirrorRef, ProseMirrorProps>(
  ({ state, ...props }, ref) => {
    const editorDomRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    useImperativeHandle(ref, () => ({
      get view() {
        return editorViewRef.current;
      },
    }));

    useEffect(() => {
      const view = new EditorView(editorDomRef.current, {
        state: state,
        ...props,
        dispatchTransaction: (transaction) => {
          view.updateState(view.state.apply(transaction));
        },
      });
      editorViewRef.current = view;
      return () => {
        view.destroy();
      };
    }, []);

    return <div ref={editorDomRef} className={classes('edim-root')}></div>;
  },
);
