import { PmpButton } from './button';
import { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export interface PmpLayerProps {
  top: number;
  left: number;
  width?: number;
  maxWidth?: number;
  height?: number;
  maxHeight?: number;
  children?: JSX.Element;
  closeOnEsc?: boolean;
  onClose?(): void;
  outerMousedown?: (e: MouseEvent) => void;
}

export const PmpLayer = (props: PmpLayerProps) => {
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

  return (
    <div className="layer-wrapper" onMouseDown={props.outerMousedown}>
      <div
        className="layer-root"
        style={{
          top: `${props.top}px`,
          left: `${props.left}px`,
          width: props.width ? `${props.width}px` : undefined,
          maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
          height: props.height ? `${props.height}px` : undefined,
          maxHeight: props.maxHeight ? `${props.maxHeight}px` : undefined,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export interface PmpLinkFormProps {
  link?: string;
  text?: string;
  onCancel?(): void;
  onSubmit?(link: string, text: string): void;
}

export const PmpLinkFormLayer = (props: PmpLinkFormProps) => {
  const [link, setLink] = useState<string>(props.link || '');
  const [text, setText] = useState<string>(props.text || '');
  return (
    <div>
      <form onSubmit={() => props.onSubmit?.(link, text)}>
        <div>
          <p>Link</p>
          <input
            type="text"
            value={link}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setLink(target.value);
            }}
          />
          <p>Text (Optional)</p>
          <input
            type="text"
            value={text}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setText(target.value);
            }}
          />
        </div>
        <div>
          <PmpButton className="laksdjfsa" type="submit">
            submit
          </PmpButton>
          <PmpButton onClick={() => props.onCancel?.()}>cancel</PmpButton>
        </div>
      </form>
    </div>
  );
};
