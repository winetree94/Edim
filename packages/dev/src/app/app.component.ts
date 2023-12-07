import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { data2 } from 'src/app/data';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { EditorView as CodeMirrorEditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { EditorProps, EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { PmpMenubarPlugin } from 'prosemirror-preset-menubar';
import { faker } from '@faker-js/faker';
import { ProseMirrorModule } from 'src/app/components/prose-mirror/prose-mirror.module';

import { PMP_DOC_NODE } from 'prosemirror-preset-document';
import {
  PMP_HEADING_NODE,
  createPmpHeadingPlugins,
} from 'prosemirror-preset-heading';
import {
  createPmpParagraphKeymapPlugins,
  PMP_PARAGRAPH_NODE,
} from 'prosemirror-preset-paragraph';
import {
  PMP_BULLET_FREE_LIST_NODE,
  PMP_FREE_LIST_ITEM_NODE,
  PMP_ORDERED_FREE_LIST_NODE,
  createPmpListPlugins,
} from 'prosemirror-preset-flat-list';
import {
  PMP_HORIZONTAL_RULE_NODE,
  createPmpHorizontalRulePlugins,
} from 'prosemirror-preset-hr';
import {
  PMP_IMAGE_NODE,
  creatPmpImagePlugins,
  PmpImagePlaceholderViewProvider,
} from 'prosemirror-preset-image';
import { createPmpBasicKeymapPlugins } from 'prosemirror-preset-keymap';
import { createPmpHistoryPlugins } from 'prosemirror-preset-history';
import {
  PMP_MENTION_MARK,
  createPmpMentionPlugins,
  MentionItem,
  PmpMentionView,
} from 'prosemirror-preset-mention';
import { PMP_LINK_MARK } from 'prosemirror-preset-link';
import {
  PMP_STRIKETHROUGH_MARK,
  PMP_STRONG_MARK,
  createPmpStrongPlugins,
  PMP_TEXT_COLOR_MARK,
  PMP_CODE_MARK,
  createPmpCodePlugins,
  PMP_ITALIC_MARK,
  createPmpItalicPlugins,
} from 'prosemirror-preset-marks';
import {
  PMP_BLOCKQUOTE_NODE,
  createPmpBlockQuotePlugins,
} from 'prosemirror-preset-blockquote';
import {
  PMP_CODE_BLOCK_NODE,
  createCodeBlockPlugins,
} from 'prosemirror-preset-codeblock';
import { PMP_TEXT_NODE } from 'prosemirror-preset-text';
import {
  PMP_TABLE_NODES,
  createPmpTableEditingPlugins,
  createPmpTablePlugins,
} from 'prosemirror-preset-tables';
import { PMP_EMOJI_NODE } from 'prosemirror-preset-emoji';
import {
  createPmpCommandPlugins,
  PmpCommandView,
} from 'prosemirror-preset-command';
import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

const items: MentionItem[] = Array.from({ length: 100 }).map(() => ({
  icon: faker.image.avatar(),
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}));

export const maximumSchema = new Schema({
  nodes: Object.assign(
    {},
    PMP_DOC_NODE,
    PMP_TEXT_NODE,
    PMP_PARAGRAPH_NODE,
    PMP_EMOJI_NODE,
    PMP_BULLET_FREE_LIST_NODE,
    PMP_FREE_LIST_ITEM_NODE,
    PMP_ORDERED_FREE_LIST_NODE,
    PMP_BLOCKQUOTE_NODE,
    PMP_HORIZONTAL_RULE_NODE,
    PMP_HEADING_NODE,
    PMP_CODE_BLOCK_NODE,
    PMP_IMAGE_NODE,
    PMP_TABLE_NODES,
  ),
  marks: Object.assign(
    {},
    PMP_TEXT_COLOR_MARK,
    PMP_MENTION_MARK,
    PMP_LINK_MARK,
    PMP_ITALIC_MARK,
    PMP_STRONG_MARK,
    PMP_CODE_MARK,
    PMP_STRIKETHROUGH_MARK,
  ),
});

export const maximumPlugins: Plugin[] = ([] as Plugin[]).concat(
  createPmpParagraphKeymapPlugins({
    nodeType: maximumSchema.nodes['paragraph'],
  }),
  createPmpMentionPlugins({
    view: (view, pluginKey) => {
      return new PmpMentionView(view, pluginKey, (keyword) =>
        items.filter((item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
    },
  }),
  createPmpCommandPlugins({
    view: (view, plugin) => new PmpCommandView(view, plugin),
  }),
  createPmpListPlugins({
    orderListNodeType: maximumSchema.nodes['ordered_list'],
    bulletListNodeType: maximumSchema.nodes['bullet_list'],
    listItemNodeType: maximumSchema.nodes['list_item'],
  }),
  createPmpBlockQuotePlugins({
    nodeType: maximumSchema.nodes['blockquote'],
  }),
  createPmpHorizontalRulePlugins({
    nodeType: maximumSchema.nodes['horizontal_rule'],
  }),
  createPmpHeadingPlugins({
    nodeType: maximumSchema.nodes['heading'],
    level: 6,
  }),
  createCodeBlockPlugins({
    nodeType: maximumSchema.nodes['code_block'],
  }),
  creatPmpImagePlugins({
    placeholderViewProvider: () => new PmpImagePlaceholderViewProvider(),
  }),
  createPmpItalicPlugins({
    markType: maximumSchema.marks['italic'],
  }),
  createPmpStrongPlugins({
    markType: maximumSchema.marks['strong'],
  }),
  createPmpCodePlugins({
    markType: maximumSchema.marks['code'],
  }),
  createPmpTablePlugins({}),
  createPmpTableEditingPlugins(),
  createPmpBasicKeymapPlugins({}),
  createPmpHistoryPlugins({}),
  [PmpMenubarPlugin, dropCursor(), gapCursor()],
);

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
    content: new FormControl<any>(
      {
        type: 'doc',
        content: [
          {
            type: 'ordered_list',
            content: [
              {
                type: 'list_item',
                attrs: {
                  indent: 1,
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                      indent: 0,
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'asldkfjalskdfj',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                attrs: {
                  indent: 1,
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      align: 'left',
                      indent: 0,
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'asdfalsdfkjasdfjlkasdf',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
            content: [
              {
                type: 'text',
                text: 'asdlfkjasdf',
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  align: 'left',
                  indent: 0,
                },
                content: [
                  {
                    type: 'text',
                    text: 'asldkfjasdf',
                  },
                ],
              },
              {
                type: 'paragraph',
                attrs: {
                  align: 'left',
                  indent: 0,
                },
                content: [
                  {
                    type: 'text',
                    text: 'asdflaskdjfa',
                  },
                ],
              },
              {
                type: 'paragraph',
                attrs: {
                  align: 'left',
                  indent: 0,
                },
                content: [
                  {
                    type: 'text',
                    text: 'sdfasdlkf',
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
            content: [
              {
                type: 'text',
                text: 'asdfasdf',
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
          },
          {
            type: 'code_block',
            content: [
              {
                type: 'text',
                text: 'aslkdfjasdf\nasdfasdfasdf',
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              align: 'left',
              indent: 0,
            },
          },
          {
            type: 'table',
            content: [
              {
                type: 'table_row',
                content: [
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: 0,
                        },
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'ordered_list',
                        content: [
                          {
                            type: 'list_item',
                            attrs: {
                              indent: '1',
                            },
                            content: [
                              {
                                type: 'paragraph',
                                attrs: {
                                  align: 'left',
                                  indent: '0',
                                },
                                content: [
                                  {
                                    type: 'text',
                                    text: 'asldkfjalskdfj',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'list_item',
                            attrs: {
                              indent: '1',
                            },
                            content: [
                              {
                                type: 'paragraph',
                                attrs: {
                                  align: 'left',
                                  indent: '0',
                                },
                                content: [
                                  {
                                    type: 'text',
                                    text: 'asdfalsdfkjasdfjlkasdf',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'asdlfkjasdf',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                      },
                      {
                        type: 'blockquote',
                        content: [
                          {
                            type: 'paragraph',
                            attrs: {
                              align: 'left',
                              indent: '0',
                            },
                            content: [
                              {
                                type: 'text',
                                text: 'asldkfjasdf',
                              },
                            ],
                          },
                          {
                            type: 'paragraph',
                            attrs: {
                              align: 'left',
                              indent: '0',
                            },
                            content: [
                              {
                                type: 'text',
                                text: 'asdflaskdjfa',
                              },
                            ],
                          },
                          {
                            type: 'paragraph',
                            attrs: {
                              align: 'left',
                              indent: '0',
                            },
                            content: [
                              {
                                type: 'text',
                                text: 'sdfasdlkf',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'asdfasdf',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: '0',
                        },
                      },
                      {
                        type: 'code_block',
                        content: [
                          {
                            type: 'text',
                            text: 'aslkdfjasdf\nasdfasdfasdf',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: 0,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: 'table_row',
                content: [
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: 0,
                        },
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: 0,
                        },
                      },
                    ],
                  },
                  {
                    type: 'table_cell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: null,
                      background: null,
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          align: 'left',
                          indent: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nonNullable: true,
      },
    ),
  });

  public values$ = this.formGroup.controls.content.valueChanges.pipe(
    startWith(this.formGroup.controls.content.value),
    map((value) => {
      if (value) {
        return JSON.stringify(value, null, 4);
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

  public state: EditorState = EditorState.create({
    schema: maximumSchema,
    plugins: maximumPlugins,
  });

  public attributes: EditorProps['attributes'] = {
    spellcheck: 'false',
  };

  @ViewChild('codeMirrorRoot', { static: true })
  public readonly codeMirrorRoot!: ElementRef<HTMLDivElement>;

  public editor!: CodeMirrorEditorView;

  /**
   * Quill 에서 복붙 대응
   */
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

  public editable(): boolean {
    return true;
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
