import { html } from '../../cdk';

export interface EdimShortcutProps {
  children: JSX.Element;
}

export const EdimShortCut = (props: EdimShortcutProps) => {
  return html`<span className="edim-ui-shortcut">${props.children}</span>`;
};
