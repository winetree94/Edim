import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimParagraph, EdimSelect, classes, html } from '@edim-editor/ui';
import { currentFontFamily } from '../../utils';
import { EdimFontFamilyMarkType } from '@edim-editor/font-family';

export const EdimMenubarFontFamilySelect = () => {
  const context = useContext(EdimMenubarContext);
  const fontFamilyMarkType = context.editorView.state.schema.marks[
    'font_family'
  ] as EdimFontFamilyMarkType;
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
  <${EdimSelect.Root} 
  className="${classes('edim-menubar-font-select')}"
  value="${currentFont}">
<${EdimSelect.Text}>
<${EdimParagraph}>
${fontOptions.find((option) => option.value === currentFont)?.label || ''}
</${EdimParagraph}>
</${EdimSelect.Text}>
<${EdimSelect.OptionGroup}>
  ${fontOptions.map((option) => {
    return html`
      <${EdimSelect.Option} value="${option.value}" onClick=${option.command}>
        <${EdimParagraph} style="font-family:${option.value}">${option.label}</${EdimParagraph}> 
      </${EdimSelect.Option}>
    `;
  })}
</${EdimSelect.OptionGroup}>
</${EdimSelect.Root}>
  `;
};
