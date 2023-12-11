import { html } from '../../cdk/render';
import { classes } from '../../cdk/utils/core';
import { HTMLAttributes, forwardRef } from 'preact/compat';

export const COLORS = [
  '#182B4D',
  '#0055CC',
  '#206A83',
  '#216E4E',
  '#E56910',
  '#AE2E24',
  '#5E4DB2',
  '#758195',
  '#1D7AFC',
  '#2898BD',
  '#22A06B',
  '#FEA362',
  '#C9372C',
  '#8270DB',
];

export interface EdimColorProps extends HTMLAttributes<HTMLSpanElement> {
  color: string;
}

export const EdimColor = ({ className, color, ...props }: EdimColorProps) => {
  return html`
    <span
      class=${classes('edim-color', className)}
      style=${{ backgroundColor: color }}
      ...${props}
    />
  `;
};

export interface EdimColorPickerProps {
  color?: string;
  onChange?(color: string): void;
}

export const EdimColorPicker = forwardRef((props: EdimColorPickerProps) => {
  const chunks = COLORS.reduce<string[][]>((result, color, index) => {
    if (index % 7 === 0) {
      result.push([]);
    }
    result[result.length - 1].push(color);
    return result;
  }, []);

  return html`
    <div class=${classes('edim-color-picker')}>
      ${chunks.map(
        (chunk) => html`
          <div class="edim-color-group">
            ${chunk.map(
              (color) => html`
                <${EdimColor}
                  color=${color}
                  className=${props.color === color ? 'selected' : ''}
                  onClick=${() => props.onChange?.(color)}
                />
              `,
            )}
          </div>
        `,
      )}
    </div>
  `;
});
