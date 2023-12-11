import { EdimMenubarContext } from '../context';
import { useContext, useRef, useState } from 'preact/hooks';
import { EdimInput, EdimLayer, EdimSelect, html } from '@edim-editor/ui';
import { getRangeFirstAlignment } from '@edim-editor/paragraph';
import { EdimLinkFormLayer, addLink } from '@edim-editor/link';
import { Fragment } from 'preact';
import { addMention } from '@edim-editor/mention';
import { TargetedEvent } from 'preact/compat';
import {
  ImagePlaceholderAddAction,
  ImagePlaceholderRemoveAction,
  ImagePlaceholderUpdateAction,
  findPlaceholderPos,
  imageFileToBase64Url,
  imagePlaceholderPluginKey,
  parseImageMeta,
} from '@edim-editor/image';
import { findParentNode } from 'prosemirror-utils';

const createFakeProgress = (
  progressChange: (progress: number) => void,
): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      progressChange(progress);
      if (progress >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 300);
  });
};

export const EdimMenubarAddMoreSelect = () => {
  const context = useContext(EdimMenubarContext);
  const firstAlignment = getRangeFirstAlignment(context.editorView.state);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [linkLayerRef, setLinkLayerRef] = useState<{
    top: number;
    left: number;
    from: number;
    to: number;
    link: string;
    text: string;
  } | null>(null);

  const options = [
    // {
    //   label: 'Mention',
    //   shortcut: html``,
    //   command: () => {
    //     addMention()(context.editorView.state, context.editorView.dispatch);
    //     context.editorView.focus();
    //   },
    // },
    {
      label: 'Link',
      shortcut: html``,
      command: () => {
        const { from, to } = context.editorView.state.selection;
        const start = context.editorView.coordsAtPos(from);
        const end = context.editorView.coordsAtPos(to);
        setLinkLayerRef({
          top: end.bottom + 10,
          left: start.left,
          from,
          to,
          link: '',
          text: context.editorView.state.doc.textBetween(from, to),
        });
      },
    },
    // {
    //   label: 'Todo List',
    //   shortcut: html``,
    //   command: () => {},
    // },
    {
      label: 'Image',
      shortcut: html``,
      command: () => {
        imageInputRef.current?.click();
      },
    },
  ];

  const onImageChange = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    const target = e.target as HTMLInputElement;
    const imageFiles = await Promise.all(
      Array.from(target.files || []).map((file) =>
        imageFileToBase64Url(file).then((url) =>
          parseImageMeta(url).then((image) => ({
            url,
            image,
          })),
        ),
      ),
    );

    await Promise.all(
      imageFiles.map(async (file) => {
        const id = Math.random().toString();
        let tr = context.editorView.state.tr;

        const adjacentInsertableParent = findParentNode((node) => {
          return node?.type.spec.group?.includes('block-container') || false;
        })(context.editorView.state.selection);

        const insertPos = adjacentInsertableParent
          ? adjacentInsertableParent.pos +
            adjacentInsertableParent.node.nodeSize
          : 0;

        tr.setMeta(imagePlaceholderPluginKey, {
          type: 'add',
          id,
          pos: insertPos,
          progress: 0,
          text_align: 'center',
          width: file.image.width,
          height: file.image.height,
          viewport_width: 80,
        } as ImagePlaceholderAddAction);

        context.editorView.dispatch(tr);

        await createFakeProgress((progress) => {
          let tr = context.editorView.state.tr;
          tr = tr.setMeta(imagePlaceholderPluginKey, {
            type: 'update',
            id,
            progress,
          } as ImagePlaceholderUpdateAction);
          context.editorView.dispatch(tr);
        });

        const pos = findPlaceholderPos(context.editorView.state, id);
        tr = context.editorView.state.tr;
        if (!pos) {
          return;
        }
        tr = tr.setMeta(imagePlaceholderPluginKey, {
          type: 'remove',
          id,
        } as ImagePlaceholderRemoveAction);
        const node = context.editorView.state.schema.nodes['image'].create({
          src: file.url,
        });
        tr = tr.replaceWith(pos, pos, node);
        context.editorView.dispatch(tr);
      }),
    );
  };

  return html`
  <${Fragment}>
    <${EdimSelect.Root} 
      value="${firstAlignment}">
      <${EdimSelect.Text}>
        <i class="ri-add-line"></i>
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup}>
      ${options.map(
        (option) => html`
        <${EdimSelect.Option}
          value="${option.label}"
          onClick=${option.command}>
          ${option.label}
        </${EdimSelect.Option}>
      `,
      )}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>

    <${EdimInput}
      ref=${imageInputRef}
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange=${(e: TargetedEvent<HTMLInputElement, Event>) => {
        void onImageChange(e);
      }}
    />

    ${
      linkLayerRef &&
      html`
      <${EdimLayer}
        top=${linkLayerRef.top}
        left=${linkLayerRef.left}
        closeOnEsc=${true}
        outerMousedown=${() => setLinkLayerRef(null)}
        onClose=${() => setLinkLayerRef(null)}
        >
        <${EdimLinkFormLayer}
          text=${linkLayerRef.text}
          link=${linkLayerRef.link}
          onSubmit=${(link: string, text: string) => {
            setLinkLayerRef(null);
            const { from, to } = context.editorView.state.selection;
            let tr = context.editorView.state.tr;
            tr = addLink(tr, from, to, text, link);
            context.editorView.dispatch(tr);
            context.editorView.focus();
          }}
          onCancel=${() => setLinkLayerRef(null)}
          />
      </${EdimLayer}>
    `
    }
   </${Fragment}> 
  `;
};
