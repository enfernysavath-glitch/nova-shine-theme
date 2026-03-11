export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  analyzedAt: string;
  tuningReference: number;
  tuningLabel: string;
  tuningDeviation: number;
  bpm: number;
  energy: number;
  mood: string;
  moodEmoji: string;
  spectrum: number[];
  duration: string;
  key: string;
  bassIntensity: number;
  brightness: number;
  confidence: number;
}

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

  return {
    id: crypto.randomUUID(),
    fileName,
    fileSize: fileSize > 1024 * 1024
      ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
      : `${(fileSize / 1024).toFixed(0)} KB`,
    analyzedAt: new Date().toISOString(),
    tuningReference: tuning.hz,
    tuningLabel: tuning.label,
    tuningDeviation: parseFloat((Math.random() * 4 - 2).toFixed(1)),
    bpm: Math.floor(Math.random() * 80) + 80,
    energy: Math.floor(Math.random() * 40) + 60,
    mood: mood.label,
    moodEmoji: mood.emoji,
    spectrum,
    duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    key: `${keys[Math.floor(Math.random() * keys.length)]} ${scales[Math.floor(Math.random() * scales.length)]}`,
    bassIntensity: Math.floor(Math.random() * 40) + 40,
    brightness: Math.floor(Math.random() * 50) + 30,
    confidence: Math.floor(Math.random() * 15) + 78,
  };
}
