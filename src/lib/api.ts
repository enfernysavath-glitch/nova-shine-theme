/**
 * Backend API response contract for /analyze endpoint.
 * This is the single source of truth for the shape of real analysis data.
 */
export interface AnalyzeApiResponse {
  file_name: string;
  file_size: number;
  uploaded_at: string;
  duration_sec: number | null;
  bpm: number;
  tuning_offset_cents: number;
  estimated_reference_hz: number;
  nearest_reference_bucket: string;
  key_signature: string;
  bass_intensity: number;
  brightness: number;
  energy_score: number;
  confidence_score: number;
  spectrum_bands: number[];
  mood_label?: string;
  mood_emoji?: string;
}

/** Mood lookup derived from energy + key (placeholder until backend provides it) */
const deriveMood = (energy: number): { label: string; emoji: string } => {
  if (energy >= 80) return { label: "Energetic", emoji: "⚡" };
  if (energy >= 60) return { label: "Uplifting", emoji: "☀️" };
  if (energy >= 40) return { label: "Calm", emoji: "🌊" };
  return { label: "Melancholic", emoji: "🌧" };
};

/** Normalised model consumed by every UI component */
export interface AnalysisResult {
  id: string;
  analysisSource: "preview" | "engine";

  /* file metadata */
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  fileDuration: string | null;

  /* analysis metrics */
  tuningReference: number;
  tuningLabel: string;
  tuningDeviation: number;
  bpm: number;
  energy: number;
  mood: string;
  moodEmoji: string;
  key: string;
  bassIntensity: number;
  brightness: number;
  confidence: number;
  spectrum: number[];
  duration: string;

  analyzedAt: string;
}

function formatBytes(bytes: number): string {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDuration(sec: number | null): string {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Convert a real API response into the normalised UI model */
export function fromApiResponse(res: AnalyzeApiResponse): AnalysisResult {
  const mood = deriveMood(res.energy_score);
  const dur = formatDuration(res.duration_sec);

  return {
    id: crypto.randomUUID(),
    analysisSource: "engine",
    fileName: res.file_name,
    fileSize: formatBytes(res.file_size),
    uploadedAt: res.uploaded_at,
    fileDuration: res.duration_sec != null ? dur : null,
    tuningReference: res.estimated_reference_hz,
    tuningLabel: res.nearest_reference_bucket,
    tuningDeviation: res.tuning_offset_cents,
    bpm: res.bpm,
    energy: res.energy_score,
    mood: mood.label,
    moodEmoji: mood.emoji,
    key: res.key_signature,
    bassIntensity: res.bass_intensity,
    brightness: res.brightness,
    confidence: res.confidence_score,
    spectrum: res.spectrum_bands,
    duration: dur,
    analyzedAt: new Date().toISOString(),
  };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Send a file to the real /analyze endpoint.
 * Returns `null` when no backend is configured so the caller can fall back to mock data.
 */
export async function analyzeFile(file: File): Promise<AnalysisResult | null> {
  if (!API_BASE) return null;

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`Analysis failed (${res.status})`);

  const json: AnalyzeApiResponse = await res.json();
  return fromApiResponse(json);
}
