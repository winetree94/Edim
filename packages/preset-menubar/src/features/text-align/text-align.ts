import { PmpMenubarContext } from '../../context';
import { useContext } from 'preact/hooks';
import { PmpSelect, classes, html } from 'prosemirror-preset-ui';
import {
  TextAlignment,
  getRangeFirstAlignment,
  setAlignment,
} from 'prosemirror-preset-paragraph';

export const PmpMenubarTextAlignSelect = () => {
  const context = useContext(PmpMenubarContext);
  const firstAlignment = getRangeFirstAlignment(context.editorView.state);

  const alignmentOptions = (['left', 'center', 'right'] as TextAlignment[]).map(
    (align) => {
      return {
        value: align,
        icon: html`<i className="ri-align-${align}" />`,
        command: () => {
          setAlignment(align)(
            context.editorView.state,
            context.editorView.dispatch,
          );
          context.editorView.focus();
        },
      };
    },
  );

  return html`
  <${PmpSelect.Root} 
  className="${classes(
    'pmp-menubar-align-select',
    firstAlignment !== 'left' ? 'pmp-menubar-align-active' : '',
  )}"
  value="${firstAlignment}">
<${PmpSelect.Text}>
  <i className="ri-align-${firstAlignment}" />
</${PmpSelect.Text}>
<${
    PmpSelect.OptionGroup
  } matchWidth="${true}" className="pmp-menubar-align-list">
${alignmentOptions.map(
  (option) => html`
  <${PmpSelect.Option} className="pmp-menubar-align-option" value="${option.value}" onClick=${option.command}>
    <i className="ri-align-${option.value}" />
  </${PmpSelect.Option}>
`,
)}
</${PmpSelect.OptionGroup}>
</${PmpSelect.Root}>
  `;
};
