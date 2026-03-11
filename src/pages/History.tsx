import { useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, clearHistory } from "@/lib/storage";
import { Clock, FileAudio, Radio, Activity, Trash2, Upload, Zap, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/mockAnalysis";

export default function History() {
  const [history, setHistory] = useState<AnalysisResult[]>(getHistory());

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Track Library</h1>
            <p className="text-muted-foreground text-xs">
              {history.length} {history.length === 1 ? "track" : "tracks"} analyzed
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive text-xs">
              <Trash2 className="w-3 h-3 mr-1" /> Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto" />
            <p className="text-muted-foreground text-sm">No analyses yet</p>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-cyan-glow glow-cyan">
              <Link to="/upload">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Analyze your first track
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table header — desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              <div className="col-span-4">Track</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Tuning</div>
              <div className="col-span-1">BPM</div>
              <div className="col-span-2">Mood</div>
              <div className="col-span-2">Energy</div>
            </div>

            {history.map((item) => (
              <Link
                key={item.id}
                to={`/results/${item.id}`}
                className="block rounded-xl bg-card border border-border hover:border-primary/20 gentle-animation group"
              >
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-12 gap-3 items-center px-4 py-3">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <FileAudio className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary gentle-animation">
                        {item.fileName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{item.fileSize} · {item.duration}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">
                    {new Date(item.analyzedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-mono font-semibold">{item.tuningReference} Hz</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-mono font-semibold">{item.bpm}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <span className="text-sm">{item.moodEmoji}</span>
                    <span className="text-xs text-muted-foreground">{item.mood}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-dim to-cyan-glow"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground w-7 text-right">{item.energy}%</span>
                    </div>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="sm:hidden p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <FileAudio className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary">{item.fileName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(item.analyzedAt).toLocaleDateString()} · {item.fileSize}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                        <Radio className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-xs font-mono font-semibold">{item.tuningReference}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                        <Activity className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-xs font-mono font-semibold">{item.bpm}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                        <Music className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-xs">{item.moodEmoji}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                        <Zap className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-xs font-mono font-semibold">{item.energy}%</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
