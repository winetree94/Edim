import { html } from '../render';
import { createContext, createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

export interface OverlayContext {
  elements: JSX.Element[];
  open(): void;
  close(): void;
}

const OverlayContext = createContext<OverlayContext>({
  elements: [],
  open: () => {},
  close: () => {},
});

const overlayContainer = ((): HTMLDivElement => {
  const exist = document.querySelector(
    'div.pmp-overlay-container',
  ) as HTMLDivElement;
  if (exist) {
    return exist;
  }
  const div = document.createElement('div');
  div.classList.add('pmp-overlay-container');
  document.body.appendChild(div);
  return div;
})();

const overlayRendered: JSX.Element[] = [];
const overlayRef = createRef();

const PmpOverlay2 = forwardRef<void>(() => {
  const open = () => {};
  const close = () => {};
  return html`
    <${OverlayContext.Provider} value="${{
      elements: [],
      open,
      close,
    }}">
    </${OverlayContext.Provider}>
  `;
});

export const reRenderOverlay = () => {
  render(
    html`
      <${PmpOverlay2}>
        ${overlayRendered}
      </${PmpOverlay2}>
    `,
    overlayContainer,
  );
};

reRenderOverlay();
