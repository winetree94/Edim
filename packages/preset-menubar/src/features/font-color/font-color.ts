import { PmpMenubarContext } from '../../context';
import { useContext } from 'preact/hooks';
import { COLORS, PmpColor, PmpSelect, classes, html } from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';

export const PmpMenubarFontColorSelect = () => {
  const context = useContext(PmpMenubarContext);
  return html`
  <${PmpSelect.Root} 
  className="${classes('pmp-menubar-color-select')}"
  value="${'black'}"
  onChange="${(color: string) => {
    const { from, to } = context.editorView.state.tr.selection;
    if (from === to) {
      toggleMark(context.editorView.state.schema.marks['textColor'], {
        color,
      })(context.editorView.state, context.editorView.dispatch);
      context.editorView.focus();
      return;
    }
    let tr = context.editorView.state.tr;
    tr = tr.addMark(
      from,
      to,
      context.editorView.state.schema.marks['textColor'].create({
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
  <span className="current-font-color"></span>
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
