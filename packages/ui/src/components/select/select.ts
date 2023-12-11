import { classes, html, EdimOverlay } from '../../cdk';
import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'preact/compat';
import { EdimLayer } from '../layer';
import { EdimListItem, EdimUnorderedList } from '../list';
import { EdimButton } from '../button';

interface EdimSelectContextValue {
  opened: DOMRect | null;
  value: string;
  onSelect: (value: string) => void;
  close: () => void;
}

const EdimSelectContext = createContext<EdimSelectContextValue>({
  opened: null,
  value: '',
  onSelect: () => {},
  close: () => {},
});

export interface EdimSelectProps {
  children: JSX.Element;
  value: string;
  className: string;
  hideArrow?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const EdimSelectRoot = forwardRef<HTMLDivElement, EdimSelectProps>(
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
    <${EdimSelectContext.Provider} value=${{
      opened: opened,
      value: props.value,
      onSelect: onSelect,
      close: close,
    }}>
      <${EdimButton}
        ref="${wrapperRef}"
        disabled="${props.disabled}"
        className="${classes(
          'edim-select',
          opened ? 'edim-active' : '',
          props.disabled ? 'edim-disabled' : '',
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
                    'edim-select-arrow-icon',
                    'ri-arrow-down-s-line',
                  )}"
                ></i>
              `
            : null
        }
      </${EdimButton}>
    </${EdimSelectContext.Provider}>
    `;
  },
);

export interface EdimSelectTextProps {
  children: JSX.Element;
}

const EdimSelectText = ({ children }: EdimSelectTextProps) => {
  return children;
};

export interface EdimSelectOptionProps {
  children: JSX.Element;
  className?: string;
  onClick?: () => void;
  value: string;
}

const EdimSelectOption = forwardRef<HTMLLIElement, EdimSelectOptionProps>(
  ({ children, value, className, onClick }, ref) => {
    const context = useContext(EdimSelectContext);
    return html`
      <${EdimListItem} 
        className="${classes(
          'edim-select-option',
          context.value === value ? 'edim-active' : '',
          className,
        )}" 
        onclick=${() => {
          context.onSelect(value);
          onClick?.();
        }}>
        ${children}
      </${EdimListItem}>
    `;
  },
);

export interface EdimSelectOptionGroupProps {
  className: string;
  children: JSX.Element;
  matchWidth: boolean;
}

const EdimSelectOptionGroup = forwardRef<
  HTMLDivElement,
  EdimSelectOptionGroupProps
>(({ className, children, ...props }) => {
  const context = useContext(EdimSelectContext);

  if (context.opened === null) {
    return null;
  }

  return html`
    <${EdimOverlay}>
      <${EdimLayer}
        left="${context.opened.left}"
        top="${context.opened.bottom}"
        maxHeight="${300}"
        width="${props.matchWidth ? context.opened.width : undefined}"
        outerMousedown="${() => context.close()}">
        <${EdimUnorderedList} className="${classes(className)}">
          ${children}
        </${EdimUnorderedList}>
      </${EdimLayer}>
    </${EdimOverlay}>
  `;
});

export const EdimSelect = {
  Root: EdimSelectRoot,
  Text: EdimSelectText,
  OptionGroup: EdimSelectOptionGroup,
  Option: EdimSelectOption,
} as const;
