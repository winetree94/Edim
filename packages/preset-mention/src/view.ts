import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionState } from './state';

export interface MentionViewProvider {
  update(view: EditorView, prevState: EditorState): void;
  destroy(): void;
}

export class MentionView implements PluginView {
  public constructor(
    private readonly editorView: EditorView,
    private readonly plugin: Plugin<MentionState>,
    private readonly mentionViewProvider: MentionViewProvider,
  ) {}

  public update(view: EditorView, prevState: EditorState): void {
    this.mentionViewProvider.update(view, prevState);
  }

  public destroy(): void {
    this.mentionViewProvider.destroy();
  }
}
