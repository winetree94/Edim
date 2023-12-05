import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface PmpParagraphProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const PmpParagraph = forwardRef<HTMLParagraphElement, PmpParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <p
        class=${classes('pmp-view-paragraph', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </p>
    `;
  },
);
