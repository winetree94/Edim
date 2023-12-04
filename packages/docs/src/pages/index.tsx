import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {
  maximumPlugins,
  maximumSchema,
} from '@site/src/components/editor/schemas/maximum';
import { EditorState } from 'prosemirror-state';
import { ProseMirror } from 'prosemirror-preset-react';
import styles from './index.module.scss';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.create({
      schema: maximumSchema,
      plugins: maximumPlugins,
    }),
  );

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      wrapperClassName={styles.EditorContainer}
    >
      <h1 className={styles.Header}>
        Fully customizable headless rich text editor
      </h1>
      <ProseMirror
        state={editorState}
        onStateChange={(state) => setEditorState(state)}
        attributes={{ spellCheck: 'false' }}
        className={styles.EditorWrapper}
      ></ProseMirror>
    </Layout>
  );
}
