import { classes, html } from '../../cdk';
import {
  forwardRef,
  HTMLAttributes,
  useImperativeHandle,
  useRef,
} from 'preact/compat';
import { useState } from 'preact/hooks';
import { PmpLayer } from '../layer';
import { PmpListItem, PmpUnorderedList } from '../list';

export interface PmpSelectProps extends HTMLAttributes<HTMLDivElement> {}

const PmpSelectRoot = forwardRef<HTMLDivElement, PmpSelectProps>(
  ({ children, ...props }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>();
    const [opened, setOpened] = useState<DOMRect | null>(null);

    useImperativeHandle(ref, () => wrapperRef.current!);

    return html`
      <div
        ref="${wrapperRef}"
        ${{ ...props }}
        className="${classes('pmp-select', props.className)}"
        onclick="${() => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          setOpened(opened ? null : rect);
        }}"
      >
        ${children}
        <i class="ri-arrow-down-s-line"></i>
        ${opened &&
        html`
          <${PmpLayer}
            left="${opened.left}"
            top="${opened.bottom}"
            maxWidth="${opened.width}"
            minWidth="${opened.width}"
            maxHeight="${300}"
          >
            <${PmpUnorderedList}>
              <${PmpListItem}>item</${PmpListItem}>
              <${PmpListItem}>item</${PmpListItem}>
              <${PmpListItem}>item</${PmpListItem}>
            </${PmpUnorderedList}>
          </${PmpLayer}>
        `}
      </div>
    `;
  },
);

const PmpSelectText = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  return html`
    <p class="${classes('pmp-select-text')}" ${{ ...props }} ref="${ref}">
      ${children}
    </p>
  `;
});

const PmpSelectOptionGroup = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return html`
    <div
      class="${classes('pmp-select-option-group')}"
      ${{ ...props }}
      ref="${ref}"
    >
      ${children}
    </div>
  `;
});

const PmpSelectOption = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return html`
    <div class="${classes('pmp-select-option')}" ${{ ...props }} ref="${ref}">
      ${children}
    </div>
  `;
});

export const PmpSelect = {
  Root: PmpSelectRoot,
  Text: PmpSelectText,
  OptionGroup: PmpSelectOptionGroup,
  Option: PmpSelectOption,
} as const;
