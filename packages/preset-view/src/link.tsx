import { PmpButton } from './button';
import { useEffect, useRef, useState } from 'preact/hooks';

export interface PmpLinkFormProps {
  link?: string;
  text?: string;
  onCancel?(): void;
  onSubmit?(link: string, text: string): void;
}

export const PmpLinkFormLayer = (props: PmpLinkFormProps) => {
  const linkRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState<string>(props.link || '');
  const [text, setText] = useState<string>(props.text || '');

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.focus();
    }
  }, []);

  return (
    <div>
      <form onSubmit={() => props.onSubmit?.(link, text)}>
        <div>
          <p>Link</p>
          <input
            ref={linkRef}
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
          <PmpButton disabled={!link} className="laksdjfsa" type="submit">
            submit
          </PmpButton>
          <PmpButton onClick={() => props.onCancel?.()}>cancel</PmpButton>
        </div>
      </form>
    </div>
  );
};
