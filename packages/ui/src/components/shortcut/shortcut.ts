import { ComponentChildren } from 'preact';
import { html } from '../../cdk';

export interface EdimShortcutProps {
  children: ComponentChildren;
}

export const EdimShortCut = (props: EdimShortcutProps) => {
  return html`<span className="edim-ui-shortcut">${props.children}</span>`;
};
