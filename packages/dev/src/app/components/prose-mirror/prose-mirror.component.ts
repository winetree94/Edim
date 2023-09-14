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
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
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
  public readonly ngControl = inject(NgControl, { optional: true, self: true });
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
          const json = JSON.stringify(tr.doc.toJSON(), null, 4);
          this._onChange(json);
        }
      },
      handleKeyDown: this.handleKeydown,
    });
  }

  public writeValue(value: string): void {
    if (!this.editorView) {
      return;
    }
    const node = Node.fromJSON(this.editorView.state.schema, JSON.parse(value));
    const state = EditorState.create({
      doc: node,
      schema: this.editorView.state.schema,
      plugins: this.editorView.state.plugins,
    });
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
