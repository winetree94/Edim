import { html } from '../render';
import { createContext, createRef, render } from 'preact';
import { createPortal, forwardRef } from 'preact/compat';

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
    'div.edim-overlay-container',
  ) as HTMLDivElement;
  if (exist) {
    return exist;
  }
  const div = document.createElement('div');
  div.classList.add('edim-overlay-container');
  document.body.appendChild(div);
  return div;
})();

const overlayRendered: JSX.Element[] = [];
const overlayRef = createRef();

const EdimOverlay2 = forwardRef<void>(() => {
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
      <${EdimOverlay2}>
        ${overlayRendered}
      </${EdimOverlay2}>
    `,
    overlayContainer,
  );
};

reRenderOverlay();

export const EdimOverlay = ({ children }: { children: JSX.Element }) => {
  return createPortal(children, overlayContainer);
};