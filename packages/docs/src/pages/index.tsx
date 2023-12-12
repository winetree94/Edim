/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      wrapperClassName={styles.EditorContainer}
    >
      <div className={styles.EditorWrapper}>
        <div className={styles.Editor}>
          <BrowserOnly fallback={<div>loading</div>}>
            {() => {
              const {
                Maximum,
              } = require('@site/src/components/examples/getting-started/maximum');
              return <Maximum className="main-editor" />;
            }}
          </BrowserOnly>
        </div>
      </div>
    </Layout>
  );
}
