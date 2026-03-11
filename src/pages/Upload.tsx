import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload as UploadIcon, FileAudio, Loader2, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { analyzeFile } from "@/lib/api";
import { saveAnalysis } from "@/lib/storage";

export default function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const steps = ["Reading file", "Estimating tuning", "Detecting BPM", "Profiling energy", "Interpreting mood", "Building spectrum"];

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      runAnalysis("Sample — Neon Cascade.mp3", 4_200_000);
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

  const runAnalysis = async (fileName: string, fileSize: number, fileObj?: File) => {
    setIsAnalyzing(true);
    setAnalyzeStep(0);
    for (let i = 0; i < steps.length; i++) {
      setAnalyzeStep(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    // Try real backend first; fall back to mock when unavailable
    let result = fileObj ? await analyzeFile(fileObj).catch(() => null) : null;
    if (!result) {
      result = generateMockAnalysis(fileName, fileSize);
    }

    navigate(`/results/${result.id}`, { state: { result } });
  };

  const handleAnalyze = () => {
    if (!file) return;
    runAnalysis(file.name, file.size, file);
  };

  const handleDemo = () => {
    runAnalysis("Sample — Neon Cascade.mp3", 4_200_000);
  };

  return (
    <div className="pt-14 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6 w-full">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1.5">
            Analyze a Track
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload an MP3 or WAV to get an estimated analysis report.
          </p>
        </div>

        {/* Drop zone — large and prominent */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative w-full rounded-2xl border-2 border-dashed gentle-animation cursor-pointer ${
            isAnalyzing ? "py-16" : "py-14 md:py-20"
          } text-center ${
            isDragging
              ? "border-primary bg-primary/5 glow-cyan-strong"
              : file
              ? "border-primary/30 bg-card"
              : "border-border hover:border-primary/20 bg-card/40 hover:bg-card/70"
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
            <div className="space-y-5 px-4">
              <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-semibold">Analyzing track...</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {steps[analyzeStep]}
                </p>
              </div>
              <div className="flex justify-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full gentle-animation ${
                      i <= analyzeStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : file ? (
            <div className="space-y-4 px-4">
              <FileAudio className="w-12 h-12 text-primary mx-auto" />
              <div>
                <p className="text-lg font-semibold">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground gentle-animation"
              >
                <X className="w-3 h-3" /> Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4 px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto">
                <UploadIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">Upload MP3 or WAV</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag & drop or click to browse — up to 50 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isAnalyzing && (
          <div className="mt-4 w-full space-y-2.5">
            {file ? (
              <Button
                size="lg"
                onClick={handleAnalyze}
                className="w-full bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold glow-cyan h-12 text-base"
              >
                Run Analysis
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Button
                  size="lg"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".mp3,.wav";
                    input.onchange = (e) => {
                      const f = (e.target as HTMLInputElement).files?.[0];
                      if (f) handleFile(f);
                    };
                    input.click();
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold glow-cyan h-12 text-base"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDemo}
                  className="flex-1 border-border hover:border-primary/30 hover:bg-primary/5 h-12"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Load Demo Track
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Demo disclaimer */}
        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          Current version uses demo analysis data for product preview.
        </p>
      </div>
    </div>
  );
}
