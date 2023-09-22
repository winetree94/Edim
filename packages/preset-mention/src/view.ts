import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionState } from './state';
import { MentionExtensionConfigs } from './plugin';
import { getMentionRange } from './utils';

export interface MentionPos {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface MentionExtentionView {
  activeStateChange?(opened: boolean): void;
  mentionPosChange?(start: MentionPos, end: MentionPos): void;
  arrowKeydown?(event: KeyboardEvent): void;
  update?(view: EditorView, prevState: EditorState): void;
  destroy?(): void;
}

export class MentionView implements PluginView {
  public constructor(
    private readonly editorView: EditorView,
    private readonly extentionConfigs: MentionExtensionConfigs,
    private readonly plugin: Plugin<MentionState>,
    private readonly mentionViewProvider: MentionExtentionView,
  ) {}

  public update(view: EditorView, prevState: EditorState): void {
    this.mentionViewProvider.update?.(view, prevState);
    const currentPluginState = this.plugin.getState(this.editorView.state);
    const previousPluginState = this.plugin.getState(prevState);

    if (currentPluginState?.actived !== previousPluginState?.actived) {
      this.mentionViewProvider.activeStateChange?.(
        !!currentPluginState?.actived,
      );
    }

    if (!currentPluginState?.actived) {
      return;
    }

    const range = getMentionRange(
      view.state,
      this.extentionConfigs.mentionKey,
      this.extentionConfigs.schemeKey,
    );

    if (!range) {
      return;
    }

    const start = view.coordsAtPos(range.rangeStart);
    const end = view.coordsAtPos(range.rangeEnd);

    this.mentionViewProvider.mentionPosChange?.(start, end);
  }

  public onArrowKeydown(event: KeyboardEvent): boolean {
    this.mentionViewProvider.arrowKeydown?.(event);
    return true;
  }

  public destroy(): void {
    this.mentionViewProvider.destroy?.();
  }
}
