import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload as UploadIcon, FileAudio, Loader2, X, Play, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { analyzeFile, AnalyzeRequestError } from "@/lib/api";
import { saveAnalysis } from "@/lib/storage";

export default function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = ["Reading file", "Estimating tuning", "Detecting BPM", "Profiling energy", "Interpreting mood", "Building spectrum"];

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      runAnalysis("Sample — Neon Cascade.mp3", 4_200_000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFilePicker = () => {
    if (isAnalyzing) return;
    console.log("[TuneTrace] file picker opened");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "mp3" && ext !== "wav") {
      console.warn("[TuneTrace] file rejected — unsupported format:", f.name);
      setError("Unsupported file format. Please select an MP3 or WAV file.");
      return;
    }
    console.log("[TuneTrace] file selected:", f.name, `(${(f.size / (1024 * 1024)).toFixed(1)} MB)`);
    setSelectedFileName(f.name);
    runAnalysis(f.name, f.size, f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      console.warn("[TuneTrace] file picker closed without selection");
      setError("No file selected. Please choose an MP3 or WAV file.");
      e.target.value = "";
      return;
    }
    handleFileSelected(f);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (!f) return;
      handleFileSelected(f);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const runAnalysis = async (fileName: string, fileSize: number, fileObj?: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalyzeStep(0);
    console.log("[TuneTrace] upload started:", fileName);

    const stepInterval = window.setInterval(() => {
      setAnalyzeStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 500);

    try {
      if (fileObj) {
        const apiResult = await analyzeFile(fileObj);

        if (apiResult) {
          const backendResult = { ...apiResult, source: "backend" as const, analysisSource: "engine" as const };
          console.log("[TuneTrace] backend response received");
          console.log("[TuneTrace] chosen source: backend");
          console.log("[TuneTrace] upload finished");
          navigate(`/results/${backendResult.id}`, { state: { result: backendResult } });
          return;
        }
      }

      const mockResult = { ...generateMockAnalysis(fileName, fileSize), source: "mock" as const, analysisSource: "preview" as const };
      console.log("[TuneTrace] chosen source: mock");
      console.log("[TuneTrace] upload finished");
      navigate(`/results/${mockResult.id}`, { state: { result: mockResult } });
    } catch (err) {
      if (err instanceof AnalyzeRequestError) {
        console.warn("[TuneTrace] ⚠️ Backend request failed, source chosen: mock —", err.message);
        const mockResult = { ...generateMockAnalysis(fileName, fileSize), source: "mock" as const, analysisSource: "preview" as const };
        console.log("[TuneTrace] chosen source: mock");
        console.log("[TuneTrace] upload finished");
        navigate(`/results/${mockResult.id}`, { state: { result: mockResult } });
        return;
      }

      if (err instanceof AnalyzeParseError) {
        console.error("[TuneTrace] ❌ upload error — parse:", err.message);
        setError("Analysis response format is invalid. Please try again.");
        return;
      }

      console.error("[TuneTrace] ❌ upload error:", err);
      setError(err instanceof Error ? err.message : "Analysis failed unexpectedly.");
    } finally {
      window.clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleDemo = () => {
    runAnalysis("Sample — Neon Cascade.mp3", 4_200_000);
  };

  return (
    <div className="pt-14 min-h-screen flex flex-col">
      {/* Hidden persistent file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav"
        className="hidden"
        onChange={onInputChange}
      />

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

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => { if (!isAnalyzing) openFilePicker(); }}
          className={`relative w-full rounded-2xl border-2 border-dashed gentle-animation cursor-pointer ${
            isAnalyzing ? "py-16" : "py-14 md:py-20"
          } text-center ${
            isDragging
              ? "border-primary bg-primary/5 glow-cyan-strong"
              : "border-border hover:border-primary/20 bg-card/40 hover:bg-card/70"
          }`}
        >
          {isAnalyzing ? (
            <div className="space-y-5 px-4">
              <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-semibold">Analyzing track...</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {steps[analyzeStep]}
                </p>
                {selectedFileName && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedFileName}</p>
                )}
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
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button
                size="lg"
                onClick={openFilePicker}
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
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 w-full flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
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