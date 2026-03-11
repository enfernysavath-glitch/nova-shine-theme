import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileAudio, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { saveAnalysis } from "@/lib/storage";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "mp3" || ext === "wav" || ext === "flac" || ext === "ogg") {
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

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    // Simulate analysis delay
    await new Promise((r) => setTimeout(r, 2200));

    const result = generateMockAnalysis(file.name, file.size);
    saveAnalysis(result);
    navigate(`/results/${result.id}`);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Upload & Analyze
          </h1>
          <p className="text-muted-foreground">
            Drop an audio file to reveal its sonic fingerprint
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center gentle-animation cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5 glow-cyan"
              : file
              ? "border-primary/30 bg-card"
              : "border-border hover:border-primary/30 bg-card/50 hover:bg-card"
          }`}
          onClick={() => {
            if (!file && !isAnalyzing) {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".mp3,.wav,.flac,.ogg";
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
              <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-semibold">Analyzing...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Detecting tuning, BPM, mood, and spectrum
                </p>
              </div>
              {/* Progress dots */}
              <div className="flex justify-center gap-2 pt-2">
                {["Tuning", "BPM", "Mood", "Spectrum"].map((step, i) => (
                  <span
                    key={step}
                    className="text-xs text-primary/70 font-mono px-2 py-1 rounded bg-primary/5 border border-primary/10"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          ) : file ? (
            <div className="space-y-4">
              <FileAudio className="w-12 h-12 text-primary mx-auto" />
              <div>
                <p className="text-lg font-semibold">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground gentle-animation"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <UploadIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">Drop your audio file here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  MP3, WAV, FLAC, or OGG — up to 50 MB
                </p>
              </div>
              <p className="text-xs text-muted-foreground">or click to browse</p>
            </div>
          )}
        </div>

        {/* Analyze button */}
        {file && !isAnalyzing && (
          <div className="mt-6 text-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              className="bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold px-10 glow-cyan"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Analyze Track
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
