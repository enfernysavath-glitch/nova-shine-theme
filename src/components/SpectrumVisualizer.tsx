interface SpectrumVisualizerProps {
  data: number[];
  height?: number;
}

export function SpectrumVisualizer({ data, height = 120 }: SpectrumVisualizerProps) {
  return (
    <div className="flex items-end gap-[2px] w-full" style={{ height }}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${Math.max(value * 100, 4)}%`,
            background: `linear-gradient(to top, var(--cyan-dim), var(--cyan-glow))`,
            opacity: 0.5 + value * 0.5,
          }}
        />
      ))}
    </div>
  );
}
