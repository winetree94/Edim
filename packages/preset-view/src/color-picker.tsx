export interface PmpColorPickerProps {
  color?: string;
  onChange?(color: string): void;
}

export const PmpColorPicker = (props: PmpColorPickerProps) => {
  return (
    <div>
      <p>color picker</p>
    </div>
  );
};
