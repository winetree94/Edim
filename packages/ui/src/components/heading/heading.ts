import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes, html } from '../../cdk';

export const EdimHeading1 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h1 className="${classes('edim-ui-h1', className)}" ...${props} ref=${ref}>
      ${children}
    </h1>
  `;
});

export const EdimHeading2 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h2 className="${classes('edim-ui-h2', className)}" ...${props} ref=${ref}>
      ${children}
    </h2>
  `;
});

export const EdimHeading3 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h3 className="${classes('edim-ui-h3', className)}" ...${props} ref=${ref}>
      ${children}
    </h3>
  `;
});

export const EdimHeading4 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h4 className="${classes('edim-ui-h4', className)}" ...${props} ref=${ref}>
      ${children}
    </h4>
  `;
});

export const EdimHeading5 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h5 className="${classes('edim-ui-h5', className)}" ...${props} ref=${ref}>
      ${children}
    </h5>
  `;
});

export const EdimHeading6 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h6 className="${classes('edim-ui-h6', className)}" ...${props} ref=${ref}>
      ${children}
    </h6>
  `;
});

export const EdimHeadingByNumber = {
  1: EdimHeading1,
  2: EdimHeading2,
  3: EdimHeading3,
  4: EdimHeading4,
  5: EdimHeading5,
  6: EdimHeading6,
};
