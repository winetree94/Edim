import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface PmpLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const PmpLabel = forwardRef<HTMLLabelElement, PmpLabelProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <label class=${classes('pmp-label', className)} ...${props} ref=${ref}>
        ${children}
      </label>
    `;
  },
);
