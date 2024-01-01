import './style.scss';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { edimPresetSchema, edimPresetPlugins } from '@edim-editor/preset';

const schema = edimPresetSchema();
const plugins = edimPresetPlugins({ schema });

const state = EditorState.create({
  schema: schema,
  plugins: plugins,
});

const view = new EditorView(document.querySelector('#editor'), {
  state: state,
  attributes: {
    spellcheck: 'false',
  },
});
