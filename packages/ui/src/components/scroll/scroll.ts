import { createContext } from 'preact';
import { html } from '../../cdk';

const EdimScrollContext = createContext({});

export const EdimScrollRoot = () => {
  return html`
    <${EdimScrollContext.Provider} value=${{}}>
    </${EdimScrollContext.Provider}>
  `;
};

export const EdimScrollViewPort = () => {
  return html``;
};
