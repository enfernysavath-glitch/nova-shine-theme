import { useParams, Link } from "react-router-dom";
import { getAnalysisById } from "@/lib/storage";
import { SpectrumVisualizer } from "@/components/SpectrumVisualizer";
import { Activity, ArrowLeft, Music, Zap, Radio, Clock, FileAudio, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const result = id ? getAnalysisById(id) : undefined;

  if (!result) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">Analysis not found</p>
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
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground gentle-animation mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to upload
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileAudio className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground font-mono">{result.fileSize} · {result.duration}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{result.fileName}</h1>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(result.analyzedAt).toLocaleString()}
          </span>
        </div>

        {/* Main stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Tuning */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Radio className="w-3.5 h-3.5" /> TUNING
            </div>
            <p className={`text-3xl font-bold font-mono ${tuningColor}`}>
              {result.tuningReference} <span className="text-base">Hz</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {result.tuningDeviation > 0 ? "+" : ""}
              {result.tuningDeviation} cents deviation
            </p>
          </div>

          {/* BPM */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Activity className="w-3.5 h-3.5" /> BPM
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{result.bpm}</p>
            <p className="text-xs text-muted-foreground mt-1">beats per minute</p>
          </div>

          {/* Energy */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Zap className="w-3.5 h-3.5" /> ENERGY
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{result.energy}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-dim to-cyan-glow"
                style={{ width: `${result.energy}%` }}
              />
            </div>
          </div>

          {/* Mood */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Music className="w-3.5 h-3.5" /> MOOD
            </div>
            <p className="text-3xl font-bold">
              {result.moodEmoji}
            </p>
            <p className="text-sm font-medium mt-1">{result.mood}</p>
          </div>
        </div>

        {/* Key & Detail row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Gauge className="w-3.5 h-3.5" /> KEY
            </div>
            <p className="text-2xl font-bold font-mono">{result.key}</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Clock className="w-3.5 h-3.5" /> DURATION
            </div>
            <p className="text-2xl font-bold font-mono">{result.duration}</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
              <Radio className="w-3.5 h-3.5" /> TUNING NOTE
            </div>
            <p className="text-sm text-muted-foreground">{result.tuningLabel}</p>
          </div>
        </div>

        {/* Spectrum */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">FREQUENCY SPECTRUM</h3>
          <SpectrumVisualizer data={result.spectrum} height={160} />
          <div className="flex justify-between text-xs text-muted-foreground mt-3 font-mono">
            <span>20 Hz</span>
            <span>500 Hz</span>
            <span>2 kHz</span>
            <span>8 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-cyan-glow glow-cyan">
            <Link to="/upload">Analyze Another</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/history">View History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
