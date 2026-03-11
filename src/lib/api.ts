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

export class AnalyzeRequestError extends Error {
  public cause?: unknown;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AnalyzeRequestError";
    this.cause = options?.cause;
  }
}

export class AnalyzeParseError extends Error {
  public cause?: unknown;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AnalyzeParseError";
    this.cause = options?.cause;
  }
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
  source: "backend" | "mock";
  analysisSource: "preview" | "engine";
  mockFallbackReason?: string;

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

function readString(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new AnalyzeParseError(`Invalid backend field: ${field} (expected string)`);
  }
  return value;
}

function readNumber(record: Record<string, unknown>, field: string): number {
  const value = record[field];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AnalyzeParseError(`Invalid backend field: ${field} (expected number)`);
  }
  return value;
}

function readNullableNumber(record: Record<string, unknown>, field: string): number | null {
  const value = record[field];
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AnalyzeParseError(`Invalid backend field: ${field} (expected number|null)`);
  }
  return value;
}

function readNumberArray(record: Record<string, unknown>, field: string): number[] {
  const value = record[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isFinite(item))) {
    throw new AnalyzeParseError(`Invalid backend field: ${field} (expected number[])`);
  }
  return value;
}

function extractJsonFromResponse(responseText: string): unknown {
  let cleaned = responseText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.search(/[\[{]/);
  if (jsonStart === -1) {
    throw new AnalyzeParseError("No JSON object found in backend response.");
  }

  const opening = cleaned[jsonStart];
  const closing = opening === "[" ? "]" : "}";
  const jsonEnd = cleaned.lastIndexOf(closing);
  if (jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new AnalyzeParseError("No valid JSON boundary found in backend response.");
  }

  cleaned = cleaned.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    const repaired = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, "");

    return JSON.parse(repaired);
  }
}

/** Convert a real API response into the normalised UI model */
export function fromApiResponse(res: AnalyzeApiResponse): AnalysisResult {
  const record = res as unknown as Record<string, unknown>;

  const fileName = readString(record, "file_name");
  const fileSize = readNumber(record, "file_size");
  const uploadedAt = readString(record, "uploaded_at");
  const durationSec = readNullableNumber(record, "duration_sec");
  const bpm = readNumber(record, "bpm");
  const tuningOffsetCents = readNumber(record, "tuning_offset_cents");
  const estimatedReferenceHz = readNumber(record, "estimated_reference_hz");
  const nearestReferenceBucket = readString(record, "nearest_reference_bucket");
  const keySignature = readString(record, "key_signature");
  const bassIntensity = readNumber(record, "bass_intensity");
  const brightness = readNumber(record, "brightness");
  const energyScore = readNumber(record, "energy_score");
  const confidenceScore = readNumber(record, "confidence_score");
  const spectrumBands = readNumberArray(record, "spectrum_bands");

  const derived = deriveMood(energyScore);
  const moodLabel = typeof record.mood_label === "string" ? record.mood_label : undefined;
  const moodEmoji = typeof record.mood_emoji === "string" ? record.mood_emoji : undefined;
  const mood = moodLabel
    ? { label: moodLabel, emoji: moodEmoji ?? derived.emoji }
    : derived;

  const dur = formatDuration(durationSec);

  return {
    id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    source: "backend",
    analysisSource: "engine",
    fileName,
    fileSize: formatBytes(fileSize),
    uploadedAt,
    fileDuration: durationSec != null ? dur : null,
    tuningReference: estimatedReferenceHz,
    tuningLabel: nearestReferenceBucket,
    tuningDeviation: tuningOffsetCents,
    bpm,
    energy: energyScore,
    mood: mood.label,
    moodEmoji: mood.emoji,
    key: keySignature,
    bassIntensity,
    brightness,
    confidence: confidenceScore,
    spectrum: spectrumBands,
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
  if (!API_BASE) {
    console.log("[TuneTrace] No VITE_API_BASE_URL configured, source chosen: mock");
    return null;
  }

  console.log("[TuneTrace] Backend request started →", `${API_BASE}/analyze`);

  const form = new FormData();
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: form,
    });
  } catch (requestErr) {
    console.error("[TuneTrace] Network error reaching backend:", requestErr);
    throw new AnalyzeRequestError("Failed to reach analysis backend.", { cause: requestErr });
  }

  console.log("[TuneTrace] Backend response received, status:", res.status);

  if (!res.ok) throw new AnalyzeRequestError(`Analysis failed (${res.status})`);

  let json: unknown;
  try {
    json = await res.json();
  } catch (jsonErr) {
    console.error("[TuneTrace] Failed to parse backend JSON:", jsonErr);
    throw new AnalyzeParseError("Backend returned invalid JSON.", { cause: jsonErr });
  }

  console.log("[TuneTrace] Raw API response:", json);

  try {
    const mapped = fromApiResponse(json as AnalyzeApiResponse);
    console.log("[TuneTrace] Source chosen: backend — analysisSource:", mapped.analysisSource);
    return mapped;
  } catch (parseErr) {
    console.error("[TuneTrace] Failed to parse API response:", parseErr, json);
    throw new AnalyzeParseError("Failed to parse analysis response from backend.", { cause: parseErr });
  }
}
