import { PmpParagraph } from './components/paragraph';
import { classes } from './cdk/core';
import { PmpListItem, PmpUnorderedList } from './components/list';
import {
  MentionPluginState,
  MentionPluginView,
} from 'prosemirror-preset-mention';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { render } from 'preact';
import { PmpLayer } from './layer';
import { getMentionRange } from 'prosemirror-preset-mention/src/utils';
import { useEffect } from 'preact/hooks';
import { html } from './cdk/html';
import { forwardRef } from 'preact/compat';

export interface MentionItem {
  icon: string;
  id: string;
  name: string;
}

export interface PmpMentionViewProps {
  items: MentionItem[];
  selectedIndex: number;
  onHover?(index: number): void;
  onClick?(index: number): void;
}

export const PmpMention = forwardRef((props: PmpMentionViewProps) => {
  useEffect(() => {
    const selected = document.querySelector(
      '.pmp-view-mention-list-item.selected',
    );
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [props.selectedIndex]);

  return html`
    <div className="pmp-view-mention-container">
      <${PmpUnorderedList}>
        ${props.items.map(
          (item, index) => html`
            <${PmpListItem}
              key=${index}
              className=${classes(
                'pmp-view-mention-list-item',
                props.selectedIndex === index ? 'selected' : '',
              )}
              onMouseMove=${() => props.onHover?.(index)}
              onClick=${() => props.onClick?.(index)}
            >
              <img
                class="pmp-view-mention-list-item-avatar"
                src=${item.icon}
              />
              <div className="pmp-view-mention-list-item-content">
                <${PmpParagraph} className="pmp-view-mention-item-name">
                  ${item.name}
                </${PmpParagraph}>
              </div>
            </${PmpListItem}>
          `,
        )}
      </${PmpUnorderedList}>
    </div>
  `;
});

export class PmpMentionView implements MentionPluginView {
  public prevKeyword: string = '';
  public wrapper: HTMLDivElement | undefined;
  public index = 0;

  public constructor(
    private readonly view: EditorView,
    private readonly pluginKey: PluginKey<MentionPluginState>,
    private readonly items: (keyword: string) => MentionItem[],
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
    pluginState: MentionPluginState,
  ): void {
    const items = this.items(pluginState.keyword);

    if (items.length === 0) {
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

    if (this.prevKeyword !== pluginState.keyword) {
      this.index = 0;
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
        <${PmpMention}
          items=${items}
          selectedIndex=${this.index}
          onHover=${(index: number) => {
            this.index = index;
            this.update(view);
          }}
          onClick=${(index: number) => {
            this.index = index;
            this.update(view);
            this.applyMention(items[index]);
          }}
        />
      </${PmpLayer}>
      `,
      this.wrapper,
    );

    this.prevKeyword = pluginState.keyword;
  }

  public applyMention(item: MentionItem) {
    if (!item.id) {
      return;
    }

    const range = getMentionRange(this.view.state);

    if (!range) {
      return;
    }

    this.view.dispatch(
      this.view.state.tr
        .replaceWith(
          range.rangeStart,
          range.rangeEnd,
          this.view.state.schema.text(`@${item.name}`),
        )
        .addMark(
          range.rangeStart,
          range.rangeStart + item.name.length + 1,
          this.view.state.schema.marks['mention'].create({
            data_id: item.id,
          }),
        ),
    );
  }

  public handleKeydown(view: EditorView, event: KeyboardEvent): boolean {
    const pluginState = this.pluginKey.getState(view.state);
    if (!pluginState || !pluginState.active) {
      return false;
    }
    const items = this.items(pluginState.keyword);
    if (event.key === 'ArrowUp') {
      this.index = Math.max(0, this.index - 1);
      this.update(view);
      return true;
    }
    if (event.key === 'ArrowDown') {
      this.index = Math.min(items.length - 1, this.index + 1);
      this.update(view);
      return true;
    }
    if (event.key === 'Enter') {
      this.applyMention(items[this.index]);
      return true;
    }
    if (event.key === 'Escape') {
      this.unmount();
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
