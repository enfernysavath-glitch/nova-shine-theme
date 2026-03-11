import { useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, clearHistory } from "@/lib/storage";
import { Clock, FileAudio, Radio, Activity, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/mockAnalysis";

export default function History() {
  const [history, setHistory] = useState<AnalysisResult[]>(getHistory());

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Analysis History</h1>
            <p className="text-muted-foreground text-sm">
              {history.length} {history.length === 1 ? "track" : "tracks"} analyzed
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground">No analyses yet</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-cyan-glow glow-cyan">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" /> Upload your first track
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Link
                key={item.id}
                to={`/results/${item.id}`}
                className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 gentle-animation group hover:glow-cyan"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <FileAudio className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate group-hover:text-primary gentle-animation">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.analyzedAt).toLocaleDateString()} · {item.fileSize} · {item.duration}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Radio className="w-3 h-3" /> Tuning
                      </div>
                      <p className="text-sm font-mono font-semibold">{item.tuningReference} Hz</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Activity className="w-3 h-3" /> BPM
                      </div>
                      <p className="text-sm font-mono font-semibold">{item.bpm}</p>
                    </div>
                    <div className="text-sm">{item.moodEmoji}</div>
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
