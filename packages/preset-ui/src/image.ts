import {
  ImagePlaceholderSpec,
  ImagePlaceholderViewProvider,
} from 'prosemirror-preset-image';
import { render } from 'preact';
import { classes } from './cdk/core';
import { html } from './cdk/html';
import { forwardRef } from 'preact/compat';

export interface PmpImagePlaceholderProps {
  progress: number;
  text_align: 'left' | 'center' | 'right';
  viewport_width: number;
  width: number;
  height: number;
}

export const PmpImagePlaceholder = forwardRef(
  (props: PmpImagePlaceholderProps) => {
    const alignClasses = {
      left: 'pmp-image-placeholder-align-left',
      center: 'pmp-image-placeholder-align-center',
      right: 'pmp-image-placeholder-align-right',
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
          'pmp-image-placeholder-view-wrapper',
          alignClasses[props.text_align],
        )}
      >
        <div
          class=${classes('pmp-image-placeholder-view-container')}
          style=${{ width: `${props.viewport_width}%` }}
        >
          <img
            class=${classes('pmp-image-placeholder-fake-image')}
            src=${url}
          />
          <div class=${classes('pmp-image-placeholer-progress-wrapper')}>
            <div>
              <span class="pmp-spinner" />
            </div>
            <div>${Math.ceil(props.progress * 100)}%</div>
          </div>
        </div>
      </div>
    `;
  },
);

export class PmpImagePlaceholderViewProvider
  implements ImagePlaceholderViewProvider
{
  public wrapper = document.createElement('div');

  public init(spec: ImagePlaceholderSpec) {
    this.render(spec);
    return this.wrapper;
  }

  public render(spec: ImagePlaceholderSpec) {
    render(
      html` <${PmpImagePlaceholder}
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
    console.log('destroyed');
  }
}
