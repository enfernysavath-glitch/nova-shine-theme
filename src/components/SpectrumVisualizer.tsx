interface SpectrumVisualizerProps {
  data: number[];
  height?: number;
}

export function SpectrumVisualizer({ data, height = 120 }: SpectrumVisualizerProps) {
  const safe = (data ?? []).map((v) => (typeof v === "number" && isFinite(v) ? Math.max(v, 0) : 0));
  const maxVal = Math.max(...safe, 1); // avoid division by zero

  return (
    <div
      className="flex items-end gap-[2px] w-full overflow-hidden"
      style={{ height, maxHeight: height }}
    >
      {safe.map((value, i) => {
        const pct = Math.min(Math.max((value / maxVal) * 100, 2), 100);
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${pct}%`,
              background: `linear-gradient(to top, var(--cyan-dim), var(--cyan-glow))`,
              opacity: 0.3 + (value / maxVal) * 0.7,
            }}
          />
        );
      })}
    </div>
  );
}
