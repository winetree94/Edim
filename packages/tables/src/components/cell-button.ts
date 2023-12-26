import { html, EdimButton } from '@edim-editor/ui';

export const EdimTableCellButtonWrapper = () => {
  return html`
    <${EdimButton} className="edim-icon-button edim-table-cell-button">
      <i class="ri-arrow-down-s-line"></i>
    </${EdimButton}>
  `;
};
