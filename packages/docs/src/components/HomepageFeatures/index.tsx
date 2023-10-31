import React, { useEffect, useRef, useState } from 'react';
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
import { Link as PmpLink } from 'prosemirror-preset-link';
import { Strikethrough } from 'prosemirror-preset-strikethrough';
import { BlockQuote } from 'prosemirror-preset-blockquote';
import { CodeBlock } from 'prosemirror-preset-codeblock';
import { Text } from 'prosemirror-preset-text';
import { TextColor } from 'prosemirror-preset-text-color';
import { Table } from 'prosemirror-preset-tables';
import { Code } from 'prosemirror-preset-code';
import { Strong } from 'prosemirror-preset-strong';
import { EmojiExtension } from 'prosemirror-preset-emoji';
import { Command } from 'prosemirror-preset-command';
import { EditorState } from 'prosemirror-state';
import {
  MentionItem,
  PmpCommandView,
  PmpImagePlaceholderViewProvider,
  PmpMentionView,
  PmpMenubarPlugin,
} from 'prosemirror-preset-view';
import { faker } from '@faker-js/faker';
import { EditorView } from 'prosemirror-view';

const items: MentionItem[] = Array.from({ length: 100 }).map(() => ({
  icon: faker.image.avatar(),
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}));

const state: EditorState = new PMEditor({
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
          items.filter((item) =>
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
    PmpLink(),
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

export default function HomepageFeatures(): JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.create({
      schema: state.schema,
      plugins: state.plugins,
    }),
  );

  useEffect(() => {
    new EditorView(editorRef.current, {
      state: editorState,
    });
  }, []);

  return <div ref={editorRef} />;
}
