import { useParams, Link } from "react-router-dom";
import { getAnalysisById } from "@/lib/storage";
import { SpectrumVisualizer } from "@/components/SpectrumVisualizer";
import {
  Activity, ArrowLeft, Music, Zap, Radio, Clock, FileAudio,
  Gauge, BarChart3, Sun, Volume2, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const result = id ? getAnalysisById(id) : undefined;

  if (!result) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Analysis not found</p>
          <Button asChild variant="outline">
            <Link to="/upload">Upload a new track</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tuningColor =
    result.tuningReference === 440
      ? "text-green-400"
      : result.tuningReference === 432
      ? "text-purple-400"
      : "text-amber-400";

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground gentle-animation mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileAudio className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-mono">{result.fileSize} · {result.duration}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{result.fileName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <ShieldCheck className="w-3 h-3" />
              {result.confidence}% confidence
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {new Date(result.analyzedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Primary metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Radio className="w-3 h-3" /> Est. Tuning
            </div>
            <p className={`text-2xl font-bold font-mono ${tuningColor}`}>
              {result.tuningReference}<span className="text-sm ml-0.5">Hz</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {result.tuningDeviation > 0 ? "+" : ""}{result.tuningDeviation} cents offset
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Activity className="w-3 h-3" /> BPM
            </div>
            <p className="text-2xl font-bold font-mono">{result.bpm}</p>
            <p className="text-[11px] text-muted-foreground mt-1">beats per minute</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Zap className="w-3 h-3" /> Energy
            </div>
            <p className="text-2xl font-bold font-mono">{result.energy}<span className="text-sm">%</span></p>
            <MetricBar value={result.energy} />
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Music className="w-3 h-3" /> Mood
            </div>
            <p className="text-lg font-bold">
              {result.moodEmoji} <span className="text-base">{result.mood}</span>
            </p>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Gauge className="w-3 h-3" /> Key
            </div>
            <p className="text-lg font-bold font-mono">{result.key}</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Clock className="w-3 h-3" /> Duration
            </div>
            <p className="text-lg font-bold font-mono">{result.duration}</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Volume2 className="w-3 h-3" /> Bass
            </div>
            <p className="text-lg font-bold font-mono">{result.bassIntensity}<span className="text-xs">%</span></p>
            <MetricBar value={result.bassIntensity} />
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Sun className="w-3 h-3" /> Brightness
            </div>
            <p className="text-lg font-bold font-mono">{result.brightness}<span className="text-xs">%</span></p>
            <MetricBar value={result.brightness} />
          </div>
        </div>

        {/* Tuning note + Confidence detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <Radio className="w-3 h-3" /> Tuning Reference
            </div>
            <p className="text-sm text-foreground">{result.tuningLabel}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Estimated closest standard reference</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3" /> Analysis Confidence
            </div>
            <p className="text-sm text-foreground">{result.confidence}% overall confidence</p>
            <MetricBar value={result.confidence} />
          </div>
        </div>

        {/* Spectrum */}
        <div className="p-5 rounded-xl bg-card border border-border mb-6">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-4">
            <BarChart3 className="w-3 h-3" /> Frequency Spectrum
          </div>
          <SpectrumVisualizer data={result.spectrum} height={140} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono">
            <span>20 Hz</span>
            <span>500 Hz</span>
            <span>2 kHz</span>
            <span>8 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-cyan-glow glow-cyan">
            <Link to="/upload">Analyze Another Track</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/history">View History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
