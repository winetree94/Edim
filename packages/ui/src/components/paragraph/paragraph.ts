import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface EdimParagraphProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const EdimParagraph = forwardRef<HTMLParagraphElement, EdimParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <p
        class=${classes('edim-view-paragraph', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </p>
    `;
  },
);
