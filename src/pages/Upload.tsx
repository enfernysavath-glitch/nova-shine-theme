import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload as UploadIcon, FileAudio, Loader2, X, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { saveAnalysis } from "@/lib/storage";

export default function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const steps = ["Reading file", "Estimating tuning", "Detecting BPM", "Profiling energy", "Interpreting mood", "Building spectrum"];

  // Auto-trigger demo if ?demo=true
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      runAnalysis("Demo Track — Stellar Drift.mp3", 4_200_000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "mp3" || ext === "wav") {
      setFile(f);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const runAnalysis = async (fileName: string, fileSize: number) => {
    setIsAnalyzing(true);
    setAnalyzeStep(0);

    for (let i = 0; i < steps.length; i++) {
      setAnalyzeStep(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    const result = generateMockAnalysis(fileName, fileSize);
    saveAnalysis(result);
    navigate(`/results/${result.id}`);
  };

  const handleAnalyze = () => {
    if (!file) return;
    runAnalysis(file.name, file.size);
  };

  const handleDemo = () => {
    runAnalysis("Demo Track — Stellar Drift.mp3", 4_200_000);
  };

  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Analyze a Track
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload an audio file to get an estimated analysis of its properties.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-10 text-center gentle-animation cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5 glow-cyan"
              : file
              ? "border-primary/30 bg-card"
              : "border-border hover:border-primary/20 bg-card/50 hover:bg-card"
          }`}
          onClick={() => {
            if (!file && !isAnalyzing) {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".mp3,.wav";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }
          }}
        >
          {isAnalyzing ? (
            <div className="space-y-4">
              <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-base font-semibold">Analyzing...</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {steps[analyzeStep]}
                </p>
              </div>
              {/* Step indicators */}
              <div className="flex justify-center gap-1.5 pt-1">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full gentle-animation ${
                      i <= analyzeStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : file ? (
            <div className="space-y-3">
              <FileAudio className="w-10 h-10 text-primary mx-auto" />
              <div>
                <p className="text-base font-semibold">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground gentle-animation"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto">
                <UploadIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold">Drop your audio file here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP3 or WAV — up to 50 MB
                </p>
              </div>
              <p className="text-xs text-muted-foreground/60">or click to browse</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isAnalyzing && (
          <div className="mt-5 space-y-3">
            {file && (
              <Button
                size="lg"
                onClick={handleAnalyze}
                className="w-full bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold glow-cyan"
              >
                Run Analysis
              </Button>
            )}

            {!file && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemo}
                className="w-full border-border hover:border-primary/30 hover:bg-primary/5"
              >
                <Play className="w-4 h-4 mr-2" />
                Try with a Sample Track
              </Button>
            )}
          </div>
        )}

        {/* Demo note */}
        <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-surface-2 border border-border text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/60" />
          <span>
            Results are currently generated using mock data for demonstration purposes. Real audio analysis will be available in a future update.
          </span>
        </div>
      </div>
    </div>
  );
}
