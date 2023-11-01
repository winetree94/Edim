import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { data2 } from 'src/app/data';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { EditorView as CodeMirrorEditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { EditorProps, EditorView } from 'prosemirror-view';
import { PMEditor } from 'prosemirror-preset-core';
import { Document } from 'prosemirror-preset-document';
import { Heading } from 'prosemirror-preset-heading';
import { Paragraph } from 'prosemirror-preset-paragraph';
import { FreeList } from 'prosemirror-preset-free-list';
import { Separator } from 'prosemirror-preset-hr';
import { Italic } from 'prosemirror-preset-italic';
import { Image } from 'prosemirror-preset-image';
import { BasicKeymap } from 'prosemirror-preset-keymap';
import { HistoryExtension } from 'prosemirror-preset-history';
import { Mention } from 'prosemirror-preset-mention';
import { Link } from 'prosemirror-preset-link';
import { Strikethrough } from 'prosemirror-preset-strikethrough';
import { BlockQuote } from 'prosemirror-preset-blockquote';
import { CodeBlock } from 'prosemirror-preset-codeblock';
import { Text } from 'prosemirror-preset-text';
import { TextColor } from 'prosemirror-preset-text-color';
import { Table } from 'prosemirror-preset-tables';
import { Code } from 'prosemirror-preset-code';
import { Strong } from 'prosemirror-preset-strong';
import { EmojiExtension } from 'prosemirror-preset-emoji';
import { EditorState } from 'prosemirror-state';
import { Command } from 'prosemirror-preset-command';
import {
  MentionItem,
  PmpCommandView,
  PmpImagePlaceholderViewProvider,
  PmpMentionView,
  PmpMenubarPlugin,
} from 'prosemirror-preset-view';
import { faker } from '@faker-js/faker';
import { ProseMirrorModule } from 'src/app/components/prose-mirror/prose-mirror.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProseMirrorModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public layout: 'vertical' | 'horizontal' = 'horizontal';
  public enable = true;

  public readonly formGroup = new FormGroup({
    content: new FormControl<string>(``, {
      nonNullable: true,
    }),
  });

  public values$ = this.formGroup.controls.content.valueChanges.pipe(
    startWith(this.formGroup.controls.content.value),
    map((value) => {
      if (value) {
        return JSON.stringify(JSON.parse(value), null, 4);
      }
      return '';
    }),
  );

  public readonly items: MentionItem[] = Array.from({ length: 100 }).map(
    () => ({
      icon: faker.image.avatar(),
      id: faker.string.uuid(),
      name: faker.person.fullName(),
    }),
  );

  public state: EditorState = new PMEditor({
    extensions: [
      Document(),
      Text(),
      TextColor(),
      Paragraph({
        addListNodes: true,
      }),
      EmojiExtension({}),
      Mention({
        view: (view, pluginKey) => {
          return new PmpMentionView(view, pluginKey, (keyword) =>
            this.items.filter((item) =>
              item.name.toLowerCase().includes(keyword.toLowerCase()),
            ),
          );
        },
      }),
      Command({
        view: (view, plugin) => new PmpCommandView(view, plugin),
      }),
      FreeList({}),
      BlockQuote(),
      Separator(),
      Heading({
        level: 6,
      }),
      CodeBlock(),
      // HardBreak(),
      Image({
        placeholderViewProvider: () => new PmpImagePlaceholderViewProvider(),
      }),
      Link(),
      Italic(),
      Strong(),
      Code(),
      Strikethrough(),
      Table({
        resizing: true,
      }),
      BasicKeymap(),
      HistoryExtension(),
    ],
    nativePlugins: (schema) => [PmpMenubarPlugin],
  }).configure();

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  @ViewChild('codeMirrorRoot', { static: true })
  public readonly codeMirrorRoot!: ElementRef<HTMLDivElement>;

  public editor!: CodeMirrorEditorView;

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

  public updateValue(): void {
    this.formGroup.controls.content.patchValue(JSON.stringify(data2));
  }

  public toggleLayout(): void {
    this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
  }

  public ngOnInit(): void {
    this.editor = new CodeMirrorEditorView({
      extensions: [basicSetup, json()],
      parent: this.codeMirrorRoot.nativeElement,
    });

    this.values$
      .pipe(
        debounceTime(1000),
        tap((value) => {
          this.editor.dispatch({
            changes: {
              from: 0,
              to: this.editor.state.doc.length,
              insert: value,
            },
          });
        }),
      )
      .subscribe();
  }
}
