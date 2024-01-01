import {
  EdimAnchor,
  EdimLayer,
  EdimOverlay,
  EdimParagraph,
  html,
} from '@edim-editor/ui';

export interface EdimLinkFloatingLayerProps {
  target: HTMLElement;
  href: string;
}

export const EdimLinkFloatingLayer = (props: EdimLinkFloatingLayerProps) => {
  return html`
    <${EdimOverlay}>
      <${EdimLayer} 
        target=${props.target}
        disableBackdrop=${true}
        className="edim-link-floating-layer-container">
        <${EdimParagraph} className="edim-link-floating-layer-paragraph">
          Visit URL: <${EdimAnchor} target="_blank" href="${props.href}">${
            props.href
          }</${EdimAnchor}>
          <${EdimAnchor}>Edit</${EdimAnchor}>
          <${EdimAnchor}
            onclick=${() => {
            }}>
            Remove
          </${EdimAnchor}>
        </${EdimParagraph}>
      </${EdimLayer}>
    </${EdimOverlay}>
  `;
};
