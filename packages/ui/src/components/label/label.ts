import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface EdimLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const EdimLabel = forwardRef<HTMLLabelElement, EdimLabelProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <label class=${classes('edim-label', className)} ...${props} ref=${ref}>
        ${children}
      </label>
    `;
  },
);
