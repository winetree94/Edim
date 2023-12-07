import { PmpMenubarContext } from '../../context';
import { useContext } from 'preact/hooks';
import { PmpParagraph, PmpSelect, classes, html } from 'prosemirror-preset-ui';
import { currentFontFamily } from '../../utils';
import { PmpFontFamilyMarkType } from 'prosemirror-preset-strikethrough';

export const PmpMenubarFontFamilySelect = () => {
  const context = useContext(PmpMenubarContext);
  const fontFamilyMarkType = context.editorView.state.schema.marks[
    'font_family'
  ] as PmpFontFamilyMarkType;
  const currentFont = currentFontFamily(context.editorView.state);

  const fontOptions = [
    {
      label: 'Default',
      value: 'default',
      command: () => {
        const tr =
          context.editorView.state.tr.removeStoredMark(fontFamilyMarkType);
        context.editorView.dispatch(tr);
        context.editorView.focus();
      },
    },
    ...fontFamilyMarkType.spec.fonts.map((font) => ({
      value: font.fontFamily,
      label: font.label,
      command: () => {
        const tr = context.editorView.state.tr.addStoredMark(
          fontFamilyMarkType.create({
            fontFamily: font.fontFamily,
          }),
        );
        context.editorView.dispatch(tr);
        context.editorView.focus();
      },
    })),
  ];
  return html`
  <${PmpSelect.Root} 
  className="${classes('pmp-menubar-font-select')}"
  value="${currentFont}">
<${PmpSelect.Text}>
<${PmpParagraph}>
${fontOptions.find((option) => option.value === currentFont)?.label || ''}
</${PmpParagraph}>
</${PmpSelect.Text}>
<${PmpSelect.OptionGroup}>
  ${fontOptions.map((option) => {
    return html`
      <${PmpSelect.Option} value="${option.value}" onClick=${option.command}>
        <${PmpParagraph} style="font-family:${option.value}">${option.label}</${PmpParagraph}> 
      </${PmpSelect.Option}>
    `;
  })}
</${PmpSelect.OptionGroup}>
</${PmpSelect.Root}>
  `;
};
