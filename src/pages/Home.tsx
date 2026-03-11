import { Link } from "react-router-dom";
import { Upload, Activity, Zap, Music, BarChart3, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpectrumVisualizer } from "@/components/SpectrumVisualizer";

const features = [
  {
    icon: Radio,
    title: "Tuning Estimate",
    description: "Estimate whether a track is closest to 432 Hz, 440 Hz, 442 Hz, or nearby references.",
  },
  {
    icon: Activity,
    title: "BPM Detection",
    description: "Measure track tempo and rhythmic pace.",
  },
  {
    icon: Zap,
    title: "Energy Profile",
    description: "Score the overall perceived intensity of the track.",
  },
  {
    icon: Music,
    title: "Mood Interpretation",
    description: "Assign a broad mood label such as calm, uplifting, dark, or energetic.",
  },
  {
    icon: BarChart3,
    title: "Spectrum Visualization",
    description: "Visualize frequency distribution using clean spectrum bars.",
  },
];

const heroSpectrum = Array.from({ length: 48 }, (_, i) => {
  const x = i / 48;
  return Math.sin(x * Math.PI * 2) * 0.3 + Math.sin(x * Math.PI * 5) * 0.2 + 0.4;
});

export default function Home() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
            <Activity className="w-3 h-3" />
            Audio Analysis Tool
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Understand what's inside
            <br />
            <span className="text-primary">your music</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload a track and get an estimated breakdown of its tuning reference, tempo, energy, mood, and frequency spectrum.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-cyan-glow font-semibold px-8 glow-cyan">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Analyze a Track
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:border-primary/40 hover:bg-primary/5">
              <Link to="/upload?demo=true">View Demo Analysis</Link>
            </Button>
          </div>

          <div className="max-w-md mx-auto pt-4 opacity-50">
            <SpectrumVisualizer data={heroSpectrum} height={60} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              What each analysis includes
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              A quick breakdown of what TuneTrace estimates from your audio file.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/20 gentle-animation"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground text-sm">TuneTrace</span>
          </div>
          <p>© {new Date().getFullYear()} TuneTrace</p>
        </div>
      </footer>
    </div>
  );
}
