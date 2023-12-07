import { html } from '../../cdk';

export interface PmpShortcutProps {
  children: JSX.Element;
}

export const PmpShortCut = (props: PmpShortcutProps) => {
  return html`<span className="pmp-ui-shortcut">${props.children}</span>`;
};
