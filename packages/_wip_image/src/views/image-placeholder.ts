import { render } from 'preact';
import { html, classes } from '@edim-editor/ui';
import { forwardRef } from 'preact/compat';
import { ImagePlaceholderViewProvider, ImagePlaceholderSpec } from '../placeholder';

export interface EdimImagePlaceholderProps {
  progress: number;
  text_align: 'left' | 'center' | 'right';
  viewport_width: number;
  width: number;
  height: number;
}

export const EdimImagePlaceholder = forwardRef(
  (props: EdimImagePlaceholderProps) => {
    const alignClasses = {
      left: 'edim-image-placeholder-align-left',
      center: 'edim-image-placeholder-align-center',
      right: 'edim-image-placeholder-align-right',
    };

    const canvas = document.createElement('canvas');
    canvas.width = props.width;
    canvas.height = props.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, props.width, props.height);
    const url = canvas.toDataURL();

    return html`
      <div
        class=${classes(
          'edim-image-placeholder-view-wrapper',
          alignClasses[props.text_align],
        )}
      >
        <div
          class=${classes('edim-image-placeholder-view-container')}
          style=${{ width: `${props.viewport_width}%` }}
        >
          <img
            class=${classes('edim-image-placeholder-fake-image')}
            src=${url}
          />
          <div class=${classes('edim-image-placeholer-progress-wrapper')}>
            <div>
              <span class="edim-spinner" />
            </div>
            <div>${Math.ceil(props.progress * 100)}%</div>
          </div>
        </div>
      </div>
    `;
  },
);

export class EdimImagePlaceholderViewProvider
  implements ImagePlaceholderViewProvider
{
  public wrapper = document.createElement('div');

  public init(spec: ImagePlaceholderSpec) {
    this.render(spec);
    return this.wrapper;
  }

  public render(spec: ImagePlaceholderSpec) {
    render(
      html` <${EdimImagePlaceholder}
        progress=${spec.progress}
        viewport_width=${spec.viewport_width}
        width=${spec.width}
        height=${spec.height}
        text_align=${spec.text_align}
      />`,
      this.wrapper,
    );
  }

  public update(spec: ImagePlaceholderSpec) {
    this.render(spec);
  }

  public destroy() {
    render(null, this.wrapper);
  }
}
