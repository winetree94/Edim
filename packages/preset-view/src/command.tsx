import { render } from 'preact';
import { EditorState, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CommandPluginState } from 'prosemirror-preset-command';
import { PmpLayer } from './view';

export interface PmpCommandProps {}

export const PmpCommand = (props: PmpCommandProps) => {
  return <div>lskdjfk</div>;
};

export class PmpCommandView implements PluginView {
  public wrapper: HTMLDivElement | undefined;

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
    console.log(pstate);
    return;
  }

  public render(
    view: EditorView,
    editorState: EditorState,
    pluginState: CommandPluginState,
  ): void {
    const { from, to } = editorState.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    if (!this.wrapper) {
      this.wrapper = document.createElement('div');
      this.view.dom.parentElement?.appendChild(this.wrapper);
    }
    render(
      <PmpLayer left={start.left} top={end.bottom}>
        <PmpCommand />
      </PmpLayer>,
      this.wrapper,
    );
  }

  public unmount(): void {
    if (this.wrapper) {
      render(null, this.wrapper);
      this.wrapper.remove();
      this.wrapper = undefined;
    }
  }

  public destroy() {
    this.unmount();
  }
}
