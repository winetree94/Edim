import { EdimLayer, html } from '@edim-editor/ui';

export interface EdimLinkFloatingLayerProps {
  target: HTMLElement;
  href: string;
}

export const EdimLinkFloatingLayer = (props: EdimLinkFloatingLayerProps) => {
  return html`
    <${EdimLayer} target=${props.target}>
      <div>Visit URL: ${props.href}</div>
    </${EdimLayer}>
  `;
};
