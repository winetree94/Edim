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
  ({ className, onStateChange, state, ...props }, ref) => {
    const editorDomRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    useImperativeHandle(ref, () => ({
      get view() {
        return editorViewRef.current!;
      },
    }));

    useEffect(() => {
      const view = new EditorView(editorDomRef.current, {
        state: state,
        ...props,
        dispatchTransaction: (transaction) => {
          if (props.dispatchTransaction) {
            props.dispatchTransaction(transaction);
          } else if (onStateChange && editorViewRef.current) {
            onStateChange(editorViewRef.current.state.apply(transaction));
          }
        },
      });
      editorViewRef.current = view;
      return () => {
        view.destroy();
      };
    }, []);

    useEffect(() => {
      if (editorViewRef.current && state) {
        editorViewRef.current.updateState(state);
      }
    }, [state]);

    return <div ref={editorDomRef} className={className}></div>;
  },
);
