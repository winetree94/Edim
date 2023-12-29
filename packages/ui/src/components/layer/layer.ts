import { JSX } from 'preact';
import { useEffect, useLayoutEffect, useState } from 'preact/hooks';
import { classes, html } from '../../cdk';
import { forwardRef } from 'preact/compat';

export interface EdimLayerPos {
  top: number;
  left: number;
  width: number | null;
  height: number | null;
}

export interface EdimLayerProps {
  top: number;
  left: number;
  target?: HTMLElement;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  children?: JSX.Element;
  closeOnEsc?: boolean;
  disableBackdrop?: boolean;
  inline?: boolean;
  className?: string;
  onClose?(): void;
  outerMousedown?: (e: MouseEvent) => void;
}

export const EdimLayer = forwardRef((props: EdimLayerProps) => {
  const [pos, setPos] = useState<EdimLayerPos>({
    top: props.top,
    left: props.left,
    width: props.width ?? null,
    height: props.height ?? null,
  });

  useEffect(() => {
    if (!props.closeOnEsc) {
      return;
    }
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

  useLayoutEffect(() => {
    const target = props.target;
    if (!target) {
      return;
    }
    const doCheck = () => {
      const rect = target.getBoundingClientRect();
      setPos({
        ...pos,
        top: rect.bottom,
        left: rect.left,
      });
    };
    doCheck();
    const scrollListener = doCheck.bind(null);
    const resizeObserver = new ResizeObserver(() => doCheck());
    window.addEventListener('scroll', scrollListener, {
      capture: true,
    });
    resizeObserver.observe(target);
    return () => {
      window.removeEventListener('scroll', scrollListener);
      resizeObserver.disconnect();
    };
  }, [props.target]);

  const layer = html`
    <div
      className="${classes('edim-layer-container', props.className)}"
      style=${{
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        width: pos.width ? `${pos.width}px` : undefined,
        minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
        maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
        height: pos.height ? `${pos.height}px` : undefined,
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
