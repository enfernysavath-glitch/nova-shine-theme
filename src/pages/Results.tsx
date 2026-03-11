import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getAnalysisById, saveAnalysis } from "@/lib/storage";
import { SpectrumVisualizer } from "@/components/SpectrumVisualizer";
import {
  Activity, ArrowLeft, Music, Zap, Radio, Clock, FileAudio,
  Gauge, BarChart3, Sun, Volume2, ShieldCheck, Save, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/mockAnalysis";

function MetricBar({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <div className="h-1.5 rounded-full bg-border overflow-hidden mt-2">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-dim to-cyan-glow gentle-animation"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/10 gentle-animation">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3" /> {label}
      </div>
      {children}
    </div>
  );
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Result can come from navigation state (fresh analysis) or from storage (history)
  const passedResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const storedResult = id ? getAnalysisById(id) : undefined;
  const result = passedResult || storedResult;

  const [saved, setSaved] = useState(!!storedResult);

  if (!result) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Analysis not found</p>
          <Button asChild variant="outline">
            <Link to="/upload">Analyze a track</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveAnalysis(result);
    setSaved(true);
  };

  const tuningColor =
    result.tuningReference === 440
      ? "text-green-400"
      : result.tuningReference === 432
      ? "text-purple-400"
      : "text-amber-400";

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Back */}
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground gentle-animation mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> New analysis
        </Link>

        {/* Prototype notice */}
        <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[12px] text-amber-200/90">
          This current version shows a preview analysis structure. True audio analysis is not fully connected yet.
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <FileAudio className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold tracking-tight truncate">{result.fileName}</h1>
              <p className="text-xs text-muted-foreground font-mono">{result.fileSize} · {result.duration} · {new Date(result.analyzedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
              Preview Analysis
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/15 text-[11px] font-medium text-primary">
              <ShieldCheck className="w-3 h-3" />
              {result.confidence}% confidence
            </div>
          </div>
        </div>

        {/* Primary metrics — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
          <StatCard icon={Radio} label="Est. Tuning">
            <p className={`text-2xl font-bold font-mono ${tuningColor}`}>
              {result.tuningReference}<span className="text-sm ml-0.5">Hz</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {result.tuningDeviation > 0 ? "+" : ""}{result.tuningDeviation} cents offset
            </p>
          </StatCard>

          <StatCard icon={Activity} label="BPM">
            <p className="text-2xl font-bold font-mono">{result.bpm}</p>
            <p className="text-[11px] text-muted-foreground mt-1">beats per minute</p>
          </StatCard>

          <StatCard icon={Zap} label="Energy">
            <p className="text-2xl font-bold font-mono">{result.energy}<span className="text-sm">%</span></p>
            <MetricBar value={result.energy} />
          </StatCard>

          <StatCard icon={Music} label="Mood">
            <p className="text-xl font-bold mt-0.5">
              {result.moodEmoji} <span className="text-base">{result.mood}</span>
            </p>
          </StatCard>
        </div>

        {/* Secondary metrics — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
          <StatCard icon={Gauge} label="Key">
            <p className="text-lg font-bold font-mono">{result.key}</p>
          </StatCard>

          <StatCard icon={Clock} label="Duration">
            <p className="text-lg font-bold font-mono">{result.duration}</p>
          </StatCard>

          <StatCard icon={Volume2} label="Bass Intensity">
            <p className="text-lg font-bold font-mono">{result.bassIntensity}<span className="text-xs">%</span></p>
            <MetricBar value={result.bassIntensity} />
          </StatCard>

          <StatCard icon={Sun} label="Brightness">
            <p className="text-lg font-bold font-mono">{result.brightness}<span className="text-xs">%</span></p>
            <MetricBar value={result.brightness} />
          </StatCard>
        </div>

        {/* Tuning detail + Confidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
          <StatCard icon={Radio} label="Tuning Reference">
            <p className="text-sm text-foreground">{result.tuningLabel}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Estimated closest standard reference</p>
          </StatCard>

          <StatCard icon={ShieldCheck} label="Confidence">
            <p className="text-sm text-foreground">{result.confidence}% overall</p>
            <MetricBar value={result.confidence} />
          </StatCard>
        </div>

        {/* Spectrum */}
        <div className="p-4 md:p-5 rounded-xl bg-card border border-border mb-5">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-3">
            <BarChart3 className="w-3 h-3" /> Frequency Spectrum
          </div>
          <SpectrumVisualizer data={result.spectrum} height={130} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono">
            <span>20 Hz</span>
            <span>500 Hz</span>
            <span>2 kHz</span>
            <span>8 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {!saved ? (
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-cyan-glow glow-cyan">
              <Save className="w-4 h-4 mr-2" />
              Save to History
            </Button>
          ) : (
            <Button disabled variant="outline" className="text-primary border-primary/20">
              <Check className="w-4 h-4 mr-2" />
              Saved to History
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/upload">Analyze Another Track</Link>
          </Button>
          {saved && (
            <Button asChild variant="ghost" className="text-muted-foreground">
              <Link to="/history">View History</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
