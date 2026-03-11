import { useEffect, useState } from "react";

interface SpectrumVisualizerProps {
  data: number[];
  animated?: boolean;
  height?: number;
}

export function SpectrumVisualizer({ data, animated = true, height = 120 }: SpectrumVisualizerProps) {
  const [bars, setBars] = useState(data);

  useEffect(() => {
    if (!animated) {
      setBars(data);
      return;
    }

    const interval = setInterval(() => {
      setBars(data.map((v) => v * (0.7 + Math.random() * 0.6)));
    }, 150);

    return () => clearInterval(interval);
  }, [data, animated]);

  return (
    <div className="flex items-end gap-[2px] w-full" style={{ height }}>
      {bars.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm gentle-animation"
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
