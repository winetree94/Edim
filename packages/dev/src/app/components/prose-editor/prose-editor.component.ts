import {
  ApplicationRef,
  Component,
  EnvironmentInjector,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef,
  forwardRef,
  inject,
} from '@angular/core';
import { EditorProps } from 'prosemirror-view';
import { ProseMirrorModule } from '../prose-mirror/prose-mirror.module';
import { ProseMirrorComponent } from '../prose-mirror/prose-mirror.component';
import { ProseEditorMenubarComponent } from './menubar/prose-editor-menubar.component';
import { PMEditor } from 'prosemirror-preset-core';
import { AngularAdapter } from 'prosemirror-preset-angular';
import { Document } from 'prosemirror-preset-document';
import { Heading } from 'prosemirror-preset-heading';
import { Paragraph } from 'prosemirror-preset-paragraph';
import { Separator } from 'prosemirror-preset-hr';
import { Italic } from 'prosemirror-preset-italic';
import { Image } from 'prosemirror-preset-image';
import { BasicKeymap } from 'prosemirror-preset-keymap';
import { History } from 'prosemirror-preset-history';
import { Mention } from 'prosemirror-preset-mention';
import { Link } from 'prosemirror-preset-link';
import { Strikethrough } from 'prosemirror-preset-strikethrough';
import { BlockQuote } from 'prosemirror-preset-blockquote';
import { CodeBlock } from 'prosemirror-preset-codeblock';
import { Text } from 'prosemirror-preset-text';
import { Table } from 'prosemirror-preset-tables';
import { Code } from 'prosemirror-preset-code';
import { Strong } from 'prosemirror-preset-strong';
import { EditorState } from 'prosemirror-state';
import { NgMenubarView } from './menubar/menubar';
import { menuBar } from 'src/app/components/prose-mirror/plugins/menu-bar/menubar';
import { buildMenuItems } from 'src/app/components/prose-mirror/plugins/menu-bar/basic-menu-items';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Node } from 'prosemirror-model';
import { MentionView } from 'src/app/components/prose-editor/mention/mention';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-prose-editor',
  templateUrl: './prose-editor.component.html',
  styleUrls: ['./prose-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, ProseMirrorModule, ProseEditorMenubarComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProseEditorComponent),
      multi: true,
    },
  ],
})
export class ProseEditorComponent implements ControlValueAccessor, OnInit {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);

  @ViewChild('menubarContentRoot', { static: true, read: ViewContainerRef })
  public menubarContentRoot!: ViewContainerRef;

  @ViewChild('menubar', { static: true })
  public menubar!: ProseEditorMenubarComponent;

  @ViewChild('proseMirror', { static: true })
  public proseMirror!: ProseMirrorComponent;

  public mentionOpened = false;

  public state: EditorState = new PMEditor({
    extensions: [
      Document(),
      Text(),
      Paragraph({
        addListNodes: true,
      }),
      Mention({
        schemeKey: 'mention',
        mentionKey: '@',
        elementName: 'ng-pmp-mention',
        view: (editorView, plugin) => {
          return new MentionView(
            editorView,
            plugin,
            this.environmentInjector,
            this.applicationRef,
            this.injector,
          );
        },
      }),
      BlockQuote(),
      Separator(),
      Heading({
        level: 6,
      }),
      CodeBlock(),
      // HardBreak(),
      Image(),
      Link(),
      Italic(),
      Strong(),
      Code(),
      Strikethrough(),
      Table({
        resizing: true,
      }),
      BasicKeymap(),
      AngularAdapter({
        applicationRef: this.applicationRef,
        environmentInjector: this.environmentInjector,
        view: NgMenubarView,
      }),
      History(),
    ],
    nativePlugins: (schema) => [
      menuBar({
        content: buildMenuItems(schema).fullMenu,
      }),
    ],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public handleKeydown(): boolean {
    return false; // Let ProseMirror handle the event as usual
  }

  public ngOnInit(): void {
    return;
  }

  public writeValue(value: string): void {
    if (!this.proseMirror.editorView) {
      this.state.doc = Node.fromJSON(this.state.schema, JSON.parse(value));
    } else {
      this.proseMirror.writeValue(value);
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.proseMirror.registerOnChange(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.proseMirror.registerOnTouched(fn);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.proseMirror.setDisabledState(isDisabled);
  }
}
