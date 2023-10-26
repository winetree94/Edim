import { classes } from './cdk/core';
import { HTMLAttributes } from 'preact/compat';

const COLORS = [
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

export interface PmpColorProps extends HTMLAttributes<HTMLSpanElement> {
  color: string;
}

export const PmpColor = ({ className, color, ...props }: PmpColorProps) => {
  return (
    <span
      className={classes('pmp-color', className)}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
};

export interface PmpColorPickerProps {
  color?: string;
  onChange?(color: string): void;
}

export const PmpColorPicker = (props: PmpColorPickerProps) => {
  const chunks = COLORS.reduce<string[][]>((result, color, index) => {
    if (index % 7 === 0) {
      result.push([]);
    }
    result[result.length - 1].push(color);
    return result;
  }, []);

  return (
    <div className={classes('pmp-color-picker')}>
      {chunks.map((chunk, index) => (
        <div key={index} className={'pmp-color-group'}>
          {chunk.map((color, index) => (
            <PmpColor
              key={index}
              color={color}
              className={props.color === color ? 'selected' : ''}
              onClick={() => props.onChange?.(color)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
