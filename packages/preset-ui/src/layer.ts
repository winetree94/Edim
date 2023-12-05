import { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { html } from './cdk/html';
import { forwardRef } from 'preact/compat';

export interface PmpLayerProps {
  top: number;
  left: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  children?: JSX.Element;
  closeOnEsc?: boolean;
  disableBackdrop?: boolean;
  onClose?(): void;
  outerMousedown?: (e: MouseEvent) => void;
}

export const PmpLayer = forwardRef((props: PmpLayerProps) => {
  useEffect(() => {
    if (!props.closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line @typescript-eslint/unbound-method
  }, [props, props.onClose, props.closeOnEsc]);

  const layer = html`
    <div
      className="layer-root"
      style=${{
        top: `${props.top}px`,
        left: `${props.left}px`,
        width: props.width ? `${props.width}px` : undefined,
        minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
        maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
        height: props.height ? `${props.height}px` : undefined,
        minHeight: props.minHeight ? `${props.minHeight}px` : undefined,
        maxHeight: props.maxHeight ? `${props.maxHeight}px` : undefined,
      }}
      onMouseDown=${(e: MouseEvent) => {
        e.stopPropagation();
      }}
    >
      ${props.children}
    </div>
  `;

  return props.disableBackdrop
    ? layer
    : html`
        <div className="layer-wrapper" onMouseDown=${props.outerMousedown}>
          ${layer}
        </div>
      `;
});
