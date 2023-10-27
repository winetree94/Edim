import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionPluginState } from './state';
import { MentionExtensionConfigs } from './plugin';
import { getMentionRange } from './utils';

export interface MentionPos {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface MentionValue {
  dataId: string;
  text: string;
}

export interface MentionExtentionView {
  onSubmit(event: KeyboardEvent): MentionValue | null;
  activeStateChange?(opened: boolean): void;
  mentionPosChange?(start: MentionPos, end: MentionPos): void;
  keywordChange?(keyword: string): void;
  arrowKeydown?(event: KeyboardEvent): void;
  update?(view: EditorView, prevState: EditorState): void;
  destroy?(): void;
}

export class MentionView implements PluginView {
  public constructor(
    private readonly editorView: EditorView,
    private readonly extentionConfigs: MentionExtensionConfigs,
    private readonly plugin: Plugin<MentionPluginState>,
    private readonly mentionViewProvider: MentionExtentionView,
  ) {}

  public update(view: EditorView, prevState: EditorState): void {
    this.mentionViewProvider.update?.(view, prevState);
    const currentPluginState = this.plugin.getState(this.editorView.state);
    const previousPluginState = this.plugin.getState(prevState);

    if (currentPluginState?.active !== previousPluginState?.active) {
      this.mentionViewProvider.activeStateChange?.(
        !!currentPluginState?.active,
      );
    }

    if (!currentPluginState?.active) {
      return;
    }

    const range = getMentionRange(view.state);

    if (!range) {
      return;
    }

    const start = view.coordsAtPos(range.rangeStart);
    const end = view.coordsAtPos(range.rangeEnd);
    this.mentionViewProvider.mentionPosChange?.(start, end);
    this.mentionViewProvider.keywordChange?.(range.keyword);
  }

  public keywordChange(keyword: string): void {
    this.mentionViewProvider.keywordChange?.(keyword);
  }

  public onArrowKeydown(event: KeyboardEvent): boolean {
    this.mentionViewProvider.arrowKeydown?.(event);
    return true;
  }

  public onSubmit(event: KeyboardEvent): MentionValue | null {
    return this.mentionViewProvider.onSubmit(event);
  }

  public destroy(): void {
    this.mentionViewProvider.destroy?.();
  }
}
