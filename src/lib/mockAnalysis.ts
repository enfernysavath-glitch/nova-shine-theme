import type { AnalysisResult } from "./api";

export type { AnalysisResult };

const moods = [
  { label: "Energetic", emoji: "⚡" },
  { label: "Melancholic", emoji: "🌧" },
  { label: "Uplifting", emoji: "☀️" },
  { label: "Dark", emoji: "🌑" },
  { label: "Dreamy", emoji: "✨" },
  { label: "Aggressive", emoji: "🔥" },
  { label: "Calm", emoji: "🌊" },
  { label: "Euphoric", emoji: "🎆" },
];

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const scales = ["Major", "Minor"];

const tuningRefs = [
  { hz: 432, label: "432 Hz — Verdi tuning" },
  { hz: 440, label: "440 Hz — Standard" },
  { hz: 442, label: "442 Hz — European orchestral" },
  { hz: 444, label: "444 Hz — Bright concert" },
];

export function generateMockAnalysis(fileName: string, fileSize: number): AnalysisResult {
  const tuning = tuningRefs[Math.floor(Math.random() * tuningRefs.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const spectrum = Array.from({ length: 32 }, () => Math.random() * 0.8 + 0.1);
  const minutes = Math.floor(Math.random() * 5) + 2;
  const seconds = Math.floor(Math.random() * 60);
  const deviation = parseFloat((Math.random() * 4 - 2).toFixed(1));
  const bpm = Math.floor(Math.random() * 80) + 80;
  const energy = Math.floor(Math.random() * 40) + 60;
  const keyStr = `${keys[Math.floor(Math.random() * keys.length)]} ${scales[Math.floor(Math.random() * scales.length)]}`;
  const bass = Math.floor(Math.random() * 40) + 40;
  const bright = Math.floor(Math.random() * 50) + 30;
  const conf = Math.floor(Math.random() * 15) + 78;
  const sizeStr = fileSize > 1024 * 1024
    ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
    : `${(fileSize / 1024).toFixed(0)} KB`;
  const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const now = new Date().toISOString();

  return {
    id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    source: "mock",
    analysisSource: "preview",
    fileName,
    fileSize: sizeStr,
    uploadedAt: now,
    fileDuration: null,
    tuningReference: tuning.hz,
    tuningLabel: tuning.label,
    tuningDeviation: deviation,
    bpm,
    energy,
    mood: mood.label,
    moodEmoji: mood.emoji,
    key: keyStr,
    bassIntensity: bass,
    brightness: bright,
    confidence: conf,
    spectrum,
    duration: durationStr,
    analyzedAt: now,
  };
}
