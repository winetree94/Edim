/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Node } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';

@Component({
  selector: 'div[ngProseMirror]',
  exportAs: 'ngProseMirror',
  template: `<ng-content></ng-content>`,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProseMirrorComponent),
      multi: true,
    },
  ],
})
export class ProseMirrorComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  public editorView!: EditorView;

  private _onChange: ((value: string) => void) | undefined;
  private _onTouched: (() => void) | undefined;

  @Input()
  public state!: EditorState;

  @Input()
  public plugins: Plugin[] = [];

  @Input()
  public attributes: DirectEditorProps['attributes'] = {};

  @Input()
  public nodeViews: DirectEditorProps['nodeViews'] = {};

  @Input()
  public dispatchTransaction: DirectEditorProps['dispatchTransaction'];

  @Input()
  public ngPlugins: Plugin[] = [];

  @Input()
  public handleKeydown: DirectEditorProps['handleKeyDown'];

  @Input()
  public transformPastedHTML: DirectEditorProps['transformPastedHTML'];

  @Input()
  public editable: (() => boolean) | undefined;

  /**
   * FormControl 로 값을 제어하는 경우, View 가 생성되기 이전에 값이 들어올 수 있어서,
   * 필드에 보관했다가 View 생성된 이후 값을 적용한다.
   */
  private initDoc: any;

  public ngOnInit(): void {
    this.editorView = new EditorView(this.elementRef.nativeElement, {
      state: this.state,
      attributes: this.attributes,
      nodeViews: this.nodeViews,
      plugins: this.plugins,
      dispatchTransaction: (tr) => {
        this.dispatchTransaction?.(tr);
        this.editorView.updateState(this.editorView.state.apply(tr));
        if (this._onChange) {
          const json = tr.doc.toJSON();
          this._onChange(json);
        }
      },
      transformPastedHTML: this.transformPastedHTML,
      handleKeyDown: this.handleKeydown,
      editable: this.editable,
    });
    if (this.initDoc) {
      this.writeValue(this.initDoc);
      this.initDoc = null;
    }
  }

  public writeValue(value: any): void {
    if (!this.editorView) {
      this.initDoc = value;
      return;
    }
    const node = Node.fromJSON(this.editorView.state.schema, value);
    const state = this.editorView.state.apply(
      this.editorView.state.tr.replaceWith(
        0,
        this.editorView.state.doc.content.size,
        node,
      ),
    );
    this.editorView.updateState(state);
  }

  public registerOnChange(fn: typeof this._onChange): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: typeof this._onTouched): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    console.log(isDisabled);
  }

  public ngOnDestroy(): void {
    this.editorView.destroy();
  }
}
