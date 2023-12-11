import { useEffect, useRef, useState } from 'preact/hooks';
import { EdimButton, EdimInput, EdimLabel, html } from '@edim-editor/ui';
import { forwardRef } from 'preact/compat';

export interface EdimLinkFormProps {
  link?: string;
  text?: string;
  onCancel?(): void;
  onSubmit?(link: string, text: string): void;
}

export const EdimLinkFormLayer = forwardRef((props: EdimLinkFormProps) => {
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
      className="edim-link-wrapper"
    >
      <${EdimLabel}>Link<//>
      <${EdimInput}
        ref=${linkRef}
        type="text"
        value=${link}
        onInput=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          setLink(target.value);
        }}
      />
      <${EdimLabel}>Text (Optional)<//>
      <${EdimInput}
        type="text"
        value=${text}
        onInput=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          setText(target.value);
        }}
      />
      <div className="edim-link-buttons">
        <${EdimButton} disabled=${!link} className="laksdjfsa" type="submit">
          submit
        <//>
        <${EdimButton} onClick=${() => props.onCancel?.()}>cancel<//>
      </div>
    </form>
  `;
});
