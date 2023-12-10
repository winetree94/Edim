import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  COLORS,
  PmpColor,
  PmpSelect,
  classes,
  html,
} from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';
import { EditorState, TextSelection } from 'prosemirror-state';
import { markActive } from 'prosemirror-preset-core';
import { PmpTextColorAttrs } from 'prosemirror-preset-text-color';

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
  )?.attrs as PmpTextColorAttrs;

  if (storedFont) {
    return storedFont.color;
  }

  const fromFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['text_color'])
    ?.attrs as PmpTextColorAttrs;

  const toFont = selection.$from
    .marks()
    .find((mark) => mark.type === state.schema.marks['text_color'])
    ?.attrs as PmpTextColorAttrs;

  if (!fromFont || !toFont) {
    return null;
  }

  if (fromFont.color !== toFont.color) {
    return null;
  }

  return fromFont.color;
};

export const PmpMenubarFontColorSelect = () => {
  const context = useContext(PmpMenubarContext);
  const currentColor = currentTextColor(context.editorView.state);

  return html`
    <${PmpSelect.Root} 
      className="${classes('pmp-menubar-color-select')}"
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
      <${PmpSelect.Text}>
        <svg 
          className="pmp-color-button-icon"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24">
          <path d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3">
          </path>
        </svg>
        <span className="current-font-color" style="${{
          backgroundColor: currentColor || 'black',
        }}"></span>
      </${PmpSelect.Text}>
      <${PmpSelect.OptionGroup} className="pmp-color-layer-list">
      ${COLORS.map(
        (color) => html`
        <${PmpSelect.Option}
        className="pmp-colo-layer-list-item"
        value="${color}">
          <${PmpColor}
            color=${color}
            className=${'context.color' === color ? 'selected' : ''}
          />
          </${PmpSelect.Option}>
        `,
      )}
      </${PmpSelect.OptionGroup}>
    </${PmpSelect.Root}>
  `;
};
