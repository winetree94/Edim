import { PmpButton } from './components/button';
import { useEffect, useRef, useState } from 'preact/hooks';
import { PmpInput } from './components/input';
import { PmpLabel } from './components/label';
import { html } from './cdk/html';
import { forwardRef } from 'preact/compat';

export interface PmpLinkFormProps {
  link?: string;
  text?: string;
  onCancel?(): void;
  onSubmit?(link: string, text: string): void;
}

export const PmpLinkFormLayer = forwardRef((props: PmpLinkFormProps) => {
  const linkRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState<string>(props.link || '');
  const [text, setText] = useState<string>(props.text || '');

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.focus();
    }
  }, []);

  return html`
    <form
      onSubmit=${() => props.onSubmit?.(link, text)}
      className="pmp-link-wrapper"
    >
      <${PmpLabel}>Link<//>
      <${PmpInput}
        ref=${linkRef}
        type="text"
        value=${link}
        onInput=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          setLink(target.value);
        }}
      />
      <${PmpLabel}>Text (Optional)<//>
      <${PmpInput}
        type="text"
        value=${text}
        onInput=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          setText(target.value);
        }}
      />
      <div className="pmp-link-buttons">
        <${PmpButton} disabled=${!link} className="laksdjfsa" type="submit">
          submit
        <//>
        <${PmpButton} onClick=${() => props.onCancel?.()}>cancel<//>
      </div>
    </form>
  `;
});
