import { useState } from 'preact/hooks';

export interface AppProps {
  name: string;
}

export const AppComponent = (props: AppProps) => {
  console.log('update');
  const [bool, setBool] = useState(false);
  const [value, setValue] = useState<string>('');
  return (
    <div>
      <input
        type="text"
        value={value}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          setValue(target.value);
        }}
      />
      {props.name} {bool}
      <div>value: {value}</div>
    </div>
  );
};
