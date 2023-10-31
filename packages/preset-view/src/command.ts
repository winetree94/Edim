/* eslint-disable @typescript-eslint/unbound-method */
import { render } from 'preact';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  CommandPluginState,
  CommandPluginView,
} from 'prosemirror-preset-command';
import { addMention } from 'prosemirror-preset-mention';
import { insertTable } from 'prosemirror-preset-tables';
import { PmpLayer } from './layer';
import { PmpListItem, PmpUnorderedList } from './components/list';
import { PmpParagraph } from './components/paragraph';
import { classes } from './cdk/core';
import { html } from './cdk/html';
import { forwardRef } from 'preact/compat';

export interface PmpCommandItem {
  icon: string;
  title: string;
  description: string;
  action: (view: EditorView, standalone?: boolean) => void;
}

export const PMP_DEFAULT_COMMAND_LIST: PmpCommandItem[] = [
  {
    icon: 'ri-at-line',
    title: 'Mention',
    description: 'insert mention',
    action: (view, standalone) => {
      const { from } = view.state.tr.selection;
      let tr = view.state.tr;
      if (!standalone) {
        tr = tr.delete(from - 1, from);
      }
      view.dispatch(tr);
      addMention()(view.state, view.dispatch);
    },
  },
  {
    icon: 'ri-grid-line',
    title: 'Table',
    description: 'insert table',
    action: (view, standalone) => {
      const { from } = view.state.tr.selection;
      let tr = view.state.tr;
      if (!standalone) {
        tr = tr.delete(from - 1, from);
      }
      view.dispatch(tr);
      insertTable()(view.state, view.dispatch);
    },
  },
];

export interface PmpCommandProps {
  items: PmpCommandItem[];
  selectedIndex: number;
  onHover?(index: number): void;
  onClick?(index: number): void;
}

export const PmpCommand = forwardRef((props: PmpCommandProps) => {
  return html`
    <div class="pmp-view-command-container">
      <${PmpUnorderedList}>
        ${props.items.map(
          (item, index) => html`
            <${PmpListItem}
              key=${index}
              className=${classes(
                'pmp-view-command-list-item',
                props.selectedIndex === index ? 'selected' : '',
              )}
              onMouseMove=${() => props.onHover?.(index)}
              onClick=${() => props.onClick?.(index)}
            >
              <i
                className=${classes(
                  item.icon,
                  'pmp-view-command-list-item-icon',
                )}
              />
              <div className="pmp-view-command-item-content">
                <${PmpParagraph}>${item.title}</${PmpParagraph}>
                <${PmpParagraph}>${item.description}</${PmpParagraph}>
              </div>
            </${PmpListItem}>
          `,
        )}
      </${PmpUnorderedList}>
    </div>
  `;
});

export class PmpCommandView implements CommandPluginView {
  public wrapper: HTMLDivElement | undefined;
  public index = 0;

  public constructor(
    private readonly view: EditorView,
    private readonly pluginKey: PluginKey<CommandPluginState>,
  ) {}

  public update(view: EditorView) {
    const pstate = this.pluginKey.getState(view.state);
    if (pstate?.active) {
      this.render(view, view.state, pstate);
    } else {
      this.unmount();
    }
    return;
  }

  public render(
    view: EditorView,
    editorState: EditorState,
    pluginState: CommandPluginState,
  ): void {
    const commands = PMP_DEFAULT_COMMAND_LIST.filter((item) => {
      if (!pluginState.keyword) {
        return true;
      }
      return (
        item.title.toLowerCase().includes(pluginState.keyword.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(pluginState.keyword.toLowerCase())
      );
    });

    if (commands.length === 0) {
      this.unmount();
      return;
    }

    const { from, to } = editorState.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    if (!this.wrapper) {
      this.wrapper = document.createElement('div');
      this.view.dom.parentElement?.appendChild(this.wrapper);
    }

    render(
      html`
        <${PmpLayer}
          left=${start.left}
          top=${end.bottom}
          disableBackdrop=${true}
          maxWidth=${200}
          minWidth=${200}
          maxHeight=${300}
        >
          <${PmpCommand}
            items=${commands}
            selectedIndex=${this.index}
            onHover=${(index: number) => {
              this.index = index;
              this.update(view);
            }}
            onClick=${(index: number) => {
              this.index = index;
              this.update(view);
              commands[index].action(view);
            }}
          />
        </${PmpLayer}>
      `,
      this.wrapper,
    );
  }

  public handleKeydown(view: EditorView, event: KeyboardEvent): boolean {
    const pluginState = this.pluginKey.getState(view.state);
    if (!pluginState || !pluginState.active) {
      return false;
    }
    if (event.key === 'ArrowUp') {
      this.index = Math.max(0, this.index - 1);
      this.update(view);
      return true;
    }
    if (event.key === 'ArrowDown') {
      this.index = Math.min(
        PMP_DEFAULT_COMMAND_LIST.length - 1,
        this.index + 1,
      );
      this.update(view);
      return true;
    }
    if (event.key === 'Enter') {
      PMP_DEFAULT_COMMAND_LIST[this.index].action(view);
      return true;
    }
    return false;
  }

  public unmount(): void {
    if (this.wrapper) {
      render(null, this.wrapper);
      this.wrapper.remove();
      this.wrapper = undefined;
      this.index = 0;
    }
  }

  public destroy() {
    this.unmount();
  }
}
