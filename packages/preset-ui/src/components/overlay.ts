import { html } from '../cdk/html';
import { createContext } from 'preact';
import { createPortal } from 'preact/compat';

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

export const overlayContainer = document.createElement('div');
overlayContainer.classList.add('pmp-overlay-container');
document.body.appendChild(overlayContainer);

export const PmpOverlay2 = () => {
  const open = () => {};

  const close = () => {};

  return html`
    <div>
      <${OverlayContext.Provider} value=${{
        elements: [],
        open,
        close,
      }}>
      </${OverlayContext.Provider}>
    </div>
  `;
};

export const PmpOverlay = (props: { children: JSX.Element }) => {
  return createPortal(props.children, overlayContainer);
};
