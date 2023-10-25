import { h, render } from 'preact';
import { Schema } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { PmpLayer } from 'prosemirror-preset-view';
import { CommandView } from './view';

export class CommandPluginView implements PluginView {
  public wrapper: HTMLDivElement;

  public constructor(
    public readonly editorView: EditorView,
    public readonly key: PluginKey<CommandPluginState>,
  ) {
    this.wrapper = document.createElement('div');
    document.body.appendChild(this.wrapper);
    this.render(editorView);
  }

  public render(view: EditorView) {
    const state = this.key.getState(view.state);
    const start = view.coordsAtPos(view.state.selection.from);
    const end = view.coordsAtPos(view.state.selection.to);
    render(
      h(
        PmpLayer,
        {
          top: end.bottom + 10,
          left: Math.min(start.left, end.left),
        },
        [h(CommandView, {})],
      ),
      this.wrapper,
    );
  }

  public unmount(): void {
    render(null, this.wrapper);
    document.body.removeChild(this.wrapper);
  }

  public update(view: EditorView) {
    this.render(view);
  }

  public destroy() {
    this.unmount();
  }
}

export interface CommandExtensionConfigs {}

export interface CommandPluginState {}

export const Command = (config: CommandExtensionConfigs): PMPluginsFactory => {
  const commandPluginKey = new PluginKey<CommandPluginState>('commandPlugin');
  return () => {
    return {
      nodes: {},
      marks: {},
      plugins: (schema: Schema) => {
        return [
          // new Plugin<CommandPluginState>({
          //   key: commandPluginKey,
          //   view: (editorView) => {
          //     return new CommandPluginView(editorView, commandPluginKey);
          //   },
          //   props: {
          //     handleTextInput: (view, from, to, text) => {
          //       if (text !== '/') {
          //         return;
          //       }
          //       console.log(view, from, to, text);
          //     },
          //   },
          //   state: {
          //     init: (config) => {
          //       return {};
          //     },
          //     apply: (tr, value) => {
          //       return value;
          //     },
          //   },
          // }),
        ];
      },
    };
  };
};
