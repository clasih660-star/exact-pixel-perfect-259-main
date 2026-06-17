type Props = {
  online: boolean;
  animate?: boolean;
};

export function OnlineStatusDot({ online, animate = true }: Props) {
  return (
    <div className="relative inline-flex h-3 w-3">
      {online && animate && (
        <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      )}
      <div
        className={`relative inline-flex h-3 w-3 rounded-full ${
          online ? "bg-green-500" : "bg-muted"
        }`}
      />
    </div>
  );
}
