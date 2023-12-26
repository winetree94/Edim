import { createPortal } from 'preact/compat';

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

export const EdimOverlay = ({ children }: { children: JSX.Element }) => {
  return createPortal(children, overlayContainer);
};
