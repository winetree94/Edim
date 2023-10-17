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
import { EditorProps, EditorView } from 'prosemirror-view';
import { ProseMirrorModule } from '../prose-mirror/prose-mirror.module';
import { ProseMirrorComponent } from '../prose-mirror/prose-mirror.component';
import { ProseEditorMenubarComponent } from './menubar/prose-editor-menubar.component';
import { PMEditor } from 'prosemirror-preset-core';
import { AngularAdapter } from 'prosemirror-preset-angular';
import { Document } from 'prosemirror-preset-document';
import { Heading } from 'prosemirror-preset-heading';
import { Paragraph } from 'prosemirror-preset-paragraph';
import { FreeList } from 'prosemirror-preset-free-list';
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
import { HardBreak } from 'prosemirror-preset-hardbreak';
import { EmojiExtension } from 'prosemirror-preset-emoji';
import { EditorState } from 'prosemirror-state';
import { NgMenubarView } from './menubar/menubar';
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
      EmojiExtension({}),
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
      FreeList({}),
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
    // nativePlugins: (schema) => [
    //   menuBar({
    //     content: buildMenuItems(schema).fullMenu,
    //   }),
    // ],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  public handleKeydown(): boolean {
    return false; // Let ProseMirror handle the event as usual
  }

  public transformPastedHTML(htmlString: string, view: EditorView) {
    const html = new DOMParser().parseFromString(htmlString, 'text/html');
    console.log(htmlString);

    // p 요소별로 마지막 br 제거 (p 에서 개행이 한번 되므로 필요 없음)
    Array.from(html.querySelectorAll('p')).forEach((p) => {
      const last = p.children[p.children.length - 1];
      if (last?.tagName !== 'BR') return;
      last.remove();
    });

    // blockquote 내부 요소를 p 로 감싼다.
    Array.from(html.querySelectorAll('blockquote')).forEach((blockquote) => {
      const child = blockquote.children[0];
      if (child?.tagName === 'P') return;
      const p = document.createElement('p');
      while (blockquote.childNodes.length > 0) {
        p.appendChild(blockquote.childNodes[0]);
      }
      blockquote.append(p);
    });

    // p 요소 내부의 br 을 p 로 분리
    Array.from(html.querySelectorAll('p > br'))
      .filter((br) => br.parentElement?.innerHTML !== '<br>')
      .forEach((br) => {
        const parent = br.parentElement!;
        const grandParent = parent.parentElement!;
        const index = Array.from(parent.childNodes).indexOf(br);

        const p = document.createElement(parent.tagName.toLowerCase());
        while (parent.childNodes.length > index) {
          p.appendChild(parent.childNodes[index]);
        }
        grandParent.insertBefore(p, parent.nextSibling);
      });

    // 단순 개행 목적인 <p><br></p> 은 제거
    // <p>...<br>...</p> 처럼 내부 개행은 <p></p><p></p> 로 분리

    // Array.from(html.querySelectorAll('p'))
    //   .filter((p) => p.innerHTML === '<br>')
    //   .forEach((p) => {
    //     p.remove();
    //   });

    console.log(html.documentElement.innerHTML);
    return html.documentElement.innerHTML;
  }

  public ngOnInit(): void {
    return;
  }

  public writeValue(value: string): void {
    if (!this.proseMirror.editorView && value) {
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
