import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <BrowserOnly fallback={<div>loading</div>}>
      {() => {
        const Edim = require('@site/src/components/editor/edim').Edim;
        return (
          <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
            wrapperClassName={styles.EditorContainer}
          >
            <div className={styles.EditorWrapper}>
              <Edim></Edim>
            </div>
          </Layout>
        );
      }}
    </BrowserOnly>
  );
}
