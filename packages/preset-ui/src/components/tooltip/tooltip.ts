import { html } from '../../cdk';
import { useEffect } from 'preact/hooks';

export interface PmpTooltipProps {
  id: string;
}

export const PmpTooltip = (props: PmpTooltipProps) => {
  useEffect(() => {
    const dom = document.getElementById(props.id);
  }, []);
  return html``;
};
