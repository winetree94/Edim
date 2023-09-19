import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface AngularAdapterConfig {
  applicationRef: ApplicationRef;
  environmentInjector: EnvironmentInjector;
  view: new (
    editorView: EditorView,
    applicationRef: ApplicationRef,
    environmentInjector: EnvironmentInjector,
  ) => PluginView;
}

export const AngularAdapter = (
  config: AngularAdapterConfig,
): PMPluginsFactory => {
  return () => {
    const plugin = new Plugin({
      view: (editor) => {
        return new config.view(
          editor,
          config.applicationRef,
          config.environmentInjector,
        );
      },
    });
    return {
      nodes: {},
      marks: {},
      plugins: () => [plugin],
    };
  };
};
