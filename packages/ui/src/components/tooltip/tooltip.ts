import { html } from '../../cdk';
import { useEffect } from 'preact/hooks';

export interface EdimTooltipProps {
  id: string;
}

export const EdimTooltip = (props: EdimTooltipProps) => {
  useEffect(() => {
    const dom = document.getElementById(props.id);
  }, []);
  return html``;
};
