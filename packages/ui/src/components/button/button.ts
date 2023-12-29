import { forwardRef } from 'preact/compat';
import { classes, html } from '../../cdk';
import { JSX } from 'preact';

export interface EdimButtonProps
  extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const EdimButton = forwardRef<HTMLButtonElement, EdimButtonProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <button
        class="${classes('edim-button', className)}"
        ...${props}
        ref="${ref}"
      >
        ${children}
      </button>
    `;
  },
);
