import type { AnalysisResult } from "./mockAnalysis";

const STORAGE_KEY = "tunetrace_history";

export function saveAnalysis(result: AnalysisResult): void {
  const history = getHistory();
  history.unshift(result);
  // Keep last 50
  if (history.length > 50) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): AnalysisResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return getHistory().find((r) => r.id === id);
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
