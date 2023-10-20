import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProseEditorModule } from 'src/app/components/prose-editor/prose-editor.module';
import { GlobalService } from 'src/app/global.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { data2 } from 'src/app/data';
import { map, startWith, tap } from 'rxjs';
import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProseEditorModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public globalService = inject(GlobalService);
  public layout: 'vertical' | 'horizontal' = 'horizontal';
  public enable = true;

  public readonly formGroup = new FormGroup({
    content: new FormControl<string>(
      `
      {
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "attrs": {
                    "textAlign": "left",
                    "indent": 0
                },
                "content": [
                    {
                        "type": "text",
                        "text": "lkjasdf"
                    }
                ]
            },
            {
                "type": "bullet_list",
                "content": [
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "laksdjflk"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "aslkdfjalksdf"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "aalskdfjasldkfjasldkfjalskdjfslkdfjalksdf"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "paragraph",
                "attrs": {
                    "textAlign": "left",
                    "indent": 0
                },
                "content": [
                    {
                        "type": "text",
                        "text": "asdfasdfasdf"
                    }
                ]
            },
            {
                "type": "ordered_list",
                "content": [
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "alksdfjlaskdfj"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "aslkdfjalskdjf"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "list_item",
                        "attrs": {
                            "indent": 1
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": "left",
                                    "indent": 0
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "asdlkfjasdf"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "paragraph",
                "attrs": {
                    "textAlign": "left",
                    "indent": 0
                },
                "content": [
                    {
                        "type": "text",
                        "text": "asdfasdfasdfasdf"
                    }
                ]
            }
        ]
    }
`,
      {
        nonNullable: true,
      },
    ),
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

  @ViewChild('codeMirrorRoot', { static: true })
  public readonly codeMirrorRoot!: ElementRef<HTMLDivElement>;

  public editor!: EditorView;

  public updateValue(): void {
    this.formGroup.controls.content.patchValue(JSON.stringify(data2));
  }

  public toggleLayout(): void {
    this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
  }

  public ngOnInit(): void {
    this.editor = new EditorView({
      extensions: [basicSetup, json()],
      parent: this.codeMirrorRoot.nativeElement,
    });

    this.values$
      .pipe(
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
