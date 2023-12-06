import { classes, html, PmpOverlay } from '../../cdk';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'preact/compat';
import { PmpLayer } from '../layer';
import { PmpListItem, PmpUnorderedList } from '../list';
import { PmpButton } from '../button';

interface PmpSelectContextValue {
  opened: DOMRect | null;
  value: string;
  onSelect: (value: string) => void;
  close: () => void;
}

const PmpSelectContext = createContext<PmpSelectContextValue>({
  opened: null,
  value: '',
  onSelect: () => {},
  close: () => {},
});

export interface PmpSelectProps {
  children: JSX.Element;
  value: string;
  className: string;
  hideArrow?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const PmpSelectRoot = forwardRef<HTMLDivElement, PmpSelectProps>(
  ({ children, className, ...props }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>();
    const [opened, setOpened] = useState<DOMRect | null>(null);

    useImperativeHandle(ref, () => wrapperRef.current!);

    const onSelect = (value: string) => {
      props.onChange?.(value);
      setOpened(null);
    };

    const close = () => {
      setOpened(null);
    };

    return html`
    <${PmpSelectContext.Provider} value=${{
      opened: opened,
      value: props.value,
      onSelect: onSelect,
      close: close,
    }}>
      <${PmpButton}
        ref="${wrapperRef}"
        disabled="${props.disabled}"
        className="${classes(
          'pmp-select',
          opened ? 'pmp-active' : '',
          props.disabled ? 'pmp-disabled' : '',
          className,
        )}"
        onclick="${() => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          setOpened(opened ? null : rect);
        }}"
      >
        ${children}
        ${
          !props.hideArrow
            ? html`
                <i
                  className="${classes(
                    'pmp-select-arrow-icon',
                    opened ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line',
                  )}"
                ></i>
              `
            : null
        }
      </${PmpButton}>
    </${PmpSelectContext.Provider}>
    `;
  },
);

export interface PmpSelectTextProps {
  children: JSX.Element;
}

const PmpSelectText = forwardRef<HTMLParagraphElement, PmpSelectTextProps>(
  ({ children, ...props }, ref) => {
    return html`
      <p className="${classes('pmp-select-text')}" ref="${ref}">${children}</p>
    `;
  },
);

export interface PmpSelectOptionProps {
  children: JSX.Element;
  value: string;
}

const PmpSelectOption = forwardRef<HTMLLIElement, PmpSelectOptionProps>(
  ({ children, value }, ref) => {
    const context = useContext(PmpSelectContext);
    return html`
      <${PmpListItem} 
        className="${classes(
          'pmp-select-option',
          context.value === value ? 'pmp-active' : '',
        )}" 
        onclick=${() => context.onSelect(value)}>
        ${children}
      </${PmpListItem}>
    `;
  },
);

const PmpSelectOptionGroup = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children }) => {
  const context = useContext(PmpSelectContext);

  if (context.opened === null) {
    return null;
  }

  return html`
    <${PmpOverlay}>
      <${PmpLayer}
        left="${context.opened.left}"
        top="${context.opened.bottom}"
        maxHeight="${300}"
        outerMousedown="${() => context.close()}"
      >
        <${PmpUnorderedList}>
          ${children}
        </${PmpUnorderedList}>
      </${PmpLayer}>
    </${PmpOverlay}>
  `;
});

export const PmpSelect = {
  Root: PmpSelectRoot,
  Text: PmpSelectText,
  OptionGroup: PmpSelectOptionGroup,
  Option: PmpSelectOption,
} as const;
