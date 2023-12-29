import { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { classes, html } from '../../cdk';

export interface EdimAnchorProps
  extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const EdimAnchor = forwardRef<HTMLAnchorElement, EdimAnchorProps>(
  ({ children, className, ...props }, ref) => {
    return html`
      <a class="${classes('edim-anchor', className)}" ...${props} ref="${ref}">
        ${children}
      </a>
    `;
  },
);
