import { Link } from "react-router-dom";
import { Upload, Activity, Zap, Music, BarChart3, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpectrumVisualizer } from "@/components/SpectrumVisualizer";

const features = [
  {
    icon: Radio,
    title: "Tuning Detection",
    description: "Detect if a track is tuned to 432 Hz, 440 Hz, 442 Hz, or other reference frequencies.",
  },
  {
    icon: Activity,
    title: "BPM Analysis",
    description: "Precise tempo detection with beat-grid alignment for any genre.",
  },
  {
    icon: Zap,
    title: "Energy Score",
    description: "Quantified energy level from calm ambient to peak-intensity tracks.",
  },
  {
    icon: Music,
    title: "Mood Detection",
    description: "AI-powered mood classification — melancholic, euphoric, dark, uplifting, and more.",
  },
  {
    icon: BarChart3,
    title: "Spectrum Analysis",
    description: "Visualize frequency distribution with real-time spectrum bars.",
  },
];

const heroSpectrum = Array.from({ length: 48 }, (_, i) => {
  const x = i / 48;
  return Math.sin(x * Math.PI * 2) * 0.3 + Math.sin(x * Math.PI * 5) * 0.2 + 0.4;
});

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            <Activity className="w-3.5 h-3.5" />
            Audio Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Decode any song's
            <br />
            <span className="text-primary text-glow-cyan">sonic DNA</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload an MP3 or WAV and instantly reveal tuning reference, BPM, energy, mood, and frequency spectrum.
            Music analysis made effortless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold px-8 glow-cyan">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Analyze a Track
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:border-primary/40 hover:bg-primary/5">
              <Link to="/history">View History</Link>
            </Button>
          </div>

          {/* Hero spectrum */}
          <div className="max-w-xl mx-auto pt-8 opacity-60">
            <SpectrumVisualizer data={heroSpectrum} height={80} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What you get from every upload
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Comprehensive audio analysis in seconds. No plugins, no DAW required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 gentle-animation hover:glow-cyan"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 gentle-animation">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl border border-border bg-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to trace the tune?</h2>
            <p className="text-muted-foreground mb-8">Upload your first track and see TuneTrace in action.</p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold px-8 glow-cyan">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">TuneTrace</span>
          </div>
          <p>© {new Date().getFullYear()} TuneTrace. Audio intelligence made simple.</p>
        </div>
      </footer>
    </div>
  );
}
