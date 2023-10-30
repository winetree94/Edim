import { ImagePlaceholderViewProvider } from 'prosemirror-preset-image';
import { render } from 'preact';

export interface PmpImagePlaceholderProps {
  progress: number;
}

export const PmpImagePlaceholder = (props: PmpImagePlaceholderProps) => {
  return <div>Placeholder {Math.floor(props.progress * 100)}</div>;
};

export class PmpImagePlaceholderProvider
  implements ImagePlaceholderViewProvider
{
  public wrapper = document.createElement('div');

  public init() {
    this.render(0);
    return this.wrapper;
  }

  public render(progress: number) {
    render(<PmpImagePlaceholder progress={progress} />, this.wrapper);
  }

  public update(progress: number) {
    this.render(progress);
  }

  public destroy() {
    render(null, this.wrapper);
    console.log('destroyed');
  }
}
