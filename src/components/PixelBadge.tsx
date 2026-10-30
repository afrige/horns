// Placeholder pixel shape (8x8 shield) tinted by rarity.
// Step 4 replaces this with a unique pixel-art bitmap per badge id.
const SHAPE = ["01111110", "11111111", "11100111", "11100111", "11111111", "01111110", "00111100", "00011000"];
const COLORS: Record<string, string> = {
  COMMON: "#a1a1aa", UNCOMMON: "#86efac", RARE: "#7dd3fc", EPIC: "#c4b5fd", LEGENDARY: "#fcd34d",
};

export function PixelBadge({ rarity, size = 20, title }: { id?: string; rarity: string; size?: number; title?: string }) {
  const fill = COLORS[rarity] ?? COLORS.COMMON;
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" role="img" aria-label={title}>
      <title>{title}</title>
      {SHAPE.flatMap((row, y) =>
        [...row].map((c, x) => (c === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill={fill} /> : null))
      )}
    </svg>
  );
}
