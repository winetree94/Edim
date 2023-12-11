import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  COLORS,
  EdimColor,
  EdimSelect,
  classes,
  html,
} from '@edim-editor/ui';
import { toggleMark } from 'prosemirror-commands';
import { EditorState, TextSelection } from 'prosemirror-state';
import { markActive } from '@edim-editor/core';
import { EdimTextColorAttrs } from '@edim-editor/text-color';

const currentTextColor = (state: EditorState): string | null => {
  const selection = state.selection;

  if (!(selection instanceof TextSelection)) {
    return null;
  }

  const actived = markActive(state, state.schema.marks['text_color']);

  if (!actived) {
    return null;
  }

  const storedFont = state.storedMarks?.find(
    (mark) => mark.type === state.schema.marks['text_color'],
  )?.attrs as EdimTextColorAttrs;

  if (storedFont) {
    return storedFont.color;
  }

  const fromFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['text_color'])
    ?.attrs as EdimTextColorAttrs;

  const toFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['text_color'])
    ?.attrs as EdimTextColorAttrs;

  if (!fromFont || !toFont) {
    return null;
  }

  if (fromFont.color !== toFont.color) {
    return null;
  }

  return fromFont.color;
};

export const EdimMenubarFontColorSelect = () => {
  const context = useContext(EdimMenubarContext);
  const currentColor = currentTextColor(context.editorView.state);

  return html`
    <${EdimSelect.Root} 
      className="${classes('edim-menubar-color-select')}"
      value="${'black'}"
      onChange="${(color: string) => {
        const { from, to } = context.editorView.state.tr.selection;
        if (from === to) {
          toggleMark(context.editorView.state.schema.marks['text_color'], {
            color,
          })(context.editorView.state, context.editorView.dispatch);
          context.editorView.focus();
          return;
        }
        let tr = context.editorView.state.tr;
        tr = tr.addMark(
          from,
          to,
          context.editorView.state.schema.marks['text_color'].create({
            color,
          }),
        );
        context.editorView.dispatch(tr);
        context.editorView.focus();
      }}">
      <${EdimSelect.Text}>
        <svg 
          className="edim-color-button-icon"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24">
          <path d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3">
          </path>
        </svg>
        <span className="current-font-color" style="${{
          backgroundColor: currentColor || 'black',
        }}"></span>
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup} className="edim-color-layer-list">
      ${COLORS.map(
        (color) => html`
        <${EdimSelect.Option}
        className="edim-colo-layer-list-item"
        value="${color}">
          <${EdimColor}
            color=${color}
            className=${'context.color' === color ? 'selected' : ''}
          />
          </${EdimSelect.Option}>
        `,
      )}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>
  `;
};
