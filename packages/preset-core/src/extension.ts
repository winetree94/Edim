import { EditorState, EditorStateConfig, Plugin } from 'prosemirror-state';
import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

export type PMPlugin = {
  nodes: Record<string, NodeSpec>;
  marks: Record<string, MarkSpec>;
  plugins: (schema: Schema) => Plugin[];
};

export type PMPluginsFactory = () => PMPlugin;

export interface PMEditorConfigs {
  doc?: EditorStateConfig['doc'];
  extensions: PMPluginsFactory[];
  nativePlugins?: (schema: Schema) => Plugin[];
}

export class PMEditor {
  public constructor(public readonly configs: PMEditorConfigs) {}

  public configure(): EditorState {
    const proseMirrorConfigs = this.configs.extensions.reduce<
      Omit<PMPlugin, 'plugins'>
    >(
      (acc, plugin) => {
        const { nodes, marks } = plugin();
        acc.nodes = { ...acc.nodes, ...nodes };
        acc.marks = { ...acc.marks, ...marks };
        return acc;
      },
      {
        nodes: {},
        marks: {},
      },
    );

    const schema = new Schema({
      nodes: proseMirrorConfigs.nodes,
      marks: proseMirrorConfigs.marks,
    });

    const plugins = this.configs.extensions.reduce<Plugin[]>(
      (acc, extension) => {
        return [...acc, ...extension().plugins(schema)];
      },
      [dropCursor(), gapCursor()],
    );

    const nativePlugins = this.configs.nativePlugins
      ? this.configs.nativePlugins(schema)
      : [];

    const mergedPlugins = [...plugins, ...nativePlugins];

    return EditorState.create({
      doc: this.configs.doc,
      schema: schema,
      plugins: mergedPlugins,
    });
  }
}
