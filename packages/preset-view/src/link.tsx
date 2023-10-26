import { PmpButton } from './components/button';
import { useEffect, useRef, useState } from 'preact/hooks';
import { PmpInput } from './components/input';
import { PmpLabel } from './components/label';

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
    <form onSubmit={() => props.onSubmit?.(link, text)}>
      <div className="pmp-link-wrapper">
        <PmpLabel>Link</PmpLabel>
        <PmpInput
          ref={linkRef}
          type="text"
          value={link}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setLink(target.value);
          }}
        />
        <PmpLabel>Text (Optional)</PmpLabel>
        <PmpInput
          type="text"
          value={text}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setText(target.value);
          }}
        />
      </div>
      <div className="pmp-link-buttons">
        <PmpButton disabled={!link} className="laksdjfsa" type="submit">
          submit
        </PmpButton>
        <PmpButton onClick={() => props.onCancel?.()}>cancel</PmpButton>
      </div>
    </form>
  );
};
