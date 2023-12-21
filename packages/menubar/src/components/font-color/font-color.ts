import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  EdimColor,
  EdimSelect,
  EdimSeparator,
  classes,
  html,
} from '@edim-editor/ui';
import { markActive } from '@edim-editor/core';
import {
  EdimTextColorAttrs,
  EdimTextColorMarkType,
  toggleTextColorWithAttrs,
} from '@edim-editor/text-color';

export const EdimMenubarFontColorSelect = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.textColor) {
    return null;
  }

  const textColorMarkType = context.options.textColor
    .textColorMarkType as EdimTextColorMarkType;

  const currentMark = markActive(context.editorView.state, textColorMarkType);
  const currentColor =
    (currentMark?.attrs as EdimTextColorAttrs | null)?.color || null;

  return html`
    <${EdimSelect.Root} 
      className="${classes('edim-menubar-color-select')}"
      value="${'black'}"
      onChange="${(color: string) => {
        toggleTextColorWithAttrs(textColorMarkType, {
          color,
        })(context.editorView.state, context.editorView.dispatch);
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
      ${textColorMarkType.spec.colors?.map(
        (color) => html`
        <${EdimSelect.Option}
          className="edim-color-layer-list-item"
          value="${color.color}">
            <${EdimColor}
              color=${color.color}
              className=${'context.color' === color.color ? 'selected' : ''}
            />
        </${EdimSelect.Option}>
        `,
      )}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>
    <${EdimSeparator} className="edim-view-menubar-separator" />
  `;
};
