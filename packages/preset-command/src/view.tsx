export interface CoordsPos {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export interface CommandLayerProps {
  start: CoordsPos;
  end: CoordsPos;
}

export const CommandLayer = (props: CommandLayerProps) => {
  return (
    <div
      class="layer-root"
      style={{
        top: `${props.end.bottom}px`,
        left: `${props.start.left}px`,
      }}
    >
      alsdkf
    </div>
  );
};

export const CommandView = () => {
  return <div class="prosemirror-command-view-root">view</div>;
};
