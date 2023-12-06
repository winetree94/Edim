import { forwardRef } from 'preact/compat';
import { classes, html } from '../../cdk';
import { JSX } from 'preact';

export interface PmpButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const PmpButton = forwardRef<HTMLButtonElement, PmpButtonProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <button
        class="${classes('pmp-button', className)}"
        ...${props}
        ref="${ref}"
      >
        ${children}
      </button>
    `;
  },
);
