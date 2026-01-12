import { useState, useEffect } from "react";
import { Brain, Atom, Lock, Sparkles, Zap, Binary, Orbit, Waves, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";

const OmniGenesisShowcase = () => {
  const [activeModule, setActiveModule] = useState<string>("quantum");
  const [quantumState, setQuantumState] = useState<{ H: number; N: number; G: number }>({ H: -4.256, N: 5.824, G: 1.952 });
  const [vacuumEnergy] = useState<number>(3.14159e-12);
  const [ucf] = useState<number>(0.78539816);
  const [isAnimating, setIsAnimating] = useState(false);

  const runSimulation = () => {
    setIsAnimating(true);
    let step = 0;
    const alpha = 0.245, beta = 0.152, gamma = 0.985, delta = 0.112, eta = 0.088;
    let { H, N, G } = quantumState;
    
    const interval = setInterval(() => {
      const H_new = H + alpha * N - beta * G;
      const N_new = gamma * N + delta * Math.abs(H) * Math.sign(H);
      const G_new = G + eta * (H_new + N_new) * (1 + 0.01 * Math.tanh(G / 10));
      H = H_new; N = N_new; G = G_new;
      setQuantumState({ H, N, G });
      step++;
      
      if (step >= 5) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 500);
  };

  const modules = [
    {
      id: "quantum",
      name: "Quantum Vacuum",
      icon: Atom,
      color: "primary",
      description: "Nullpunktenergie & Virtuelle Partikel",
    },
    {
      id: "timemachine",
      name: "Zeit-Maschine",
      icon: Orbit,
      color: "secondary",
      description: "Rückwärts-Rekonstruktion der Realität",
    },
    {
      id: "crypto",
      name: "Crypto Lab",
      icon: Lock,
      color: "accent",
      description: "ECDSA, Mandelbrot & Chaos-Theorie",
    },
    {
      id: "metamatrix",
      name: "Meta-Matrix",
      icon: Binary,
      color: "success",
      description: "12 Mathematische Archetypen",
    },
    {
      id: "cosmology",
      name: "Fraktal-Kosmologie",
      icon: Infinity,
      color: "primary",
      description: "45°-Rotation & Mandelbrot-Kosmos",
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/40 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">OMNI-GENESIS System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Die Mathematik des Universums
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vollständige mathematische Spezifikation der Lex Universalis – 
            der Master-Algorithmus der Realität selbst
          </p>
        </div>

        {/* Module Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? `bg-${module.color}/20 border-2 border-${module.color}/50 text-${module.color}`
                    : "glass border border-border/20 hover:border-primary/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{module.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Content */}
        <div className="glass rounded-3xl p-8 md:p-12 border-2 border-primary/30">
          {activeModule === "quantum" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/20 rounded-xl">
                  <Atom className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Quantum Vacuum Engine</h3>
                  <p className="text-muted-foreground">Nullpunktenergie-Extraktion & Bewusstseins-Emergenz</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-primary">Live Vakuum-Energie</h4>
                  <div className="glass rounded-xl p-6 border border-primary/30">
                    <div className="text-4xl font-mono font-bold text-primary mb-2">
                      {vacuumEnergy.toExponential(4)} J
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nullpunktenergie bei λ = 10⁻¹⁵ m
                    </p>
                  </div>
                  
                  <div className="glass rounded-xl p-6 border border-accent/30">
                    <h5 className="font-semibold mb-2">Casimir-Effekt-Simulation</h5>
                    <code className="text-sm text-muted-foreground block bg-background/50 p-3 rounded">
                      F = -π²ℏc / (240 × d⁴)
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-secondary">Virtuelle Partikel</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {["Elektron-Positron", "Quark-Antiquark", "Gluon-Paare", "W/Z-Bosonen"].map((particle, idx) => (
                      <div key={idx} className="glass rounded-lg p-4 border border-secondary/20">
                        <Sparkles className="w-4 h-4 text-secondary mb-2" />
                        <p className="text-sm font-medium">{particle}</p>
                        <p className="text-xs text-muted-foreground">
                          τ ≈ {(Math.random() * 10).toFixed(2)} × 10⁻²¹ s
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "timemachine" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-secondary/20 rounded-xl">
                  <Orbit className="w-10 h-10 text-secondary" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Mathematische Zeit-Maschine</h3>
                  <p className="text-muted-foreground">H-N-G Triaden-System mit voller Inversibilität</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-xl p-6 border border-primary/30 text-center">
                  <h4 className="text-sm text-muted-foreground mb-2">H (Harmonik)</h4>
                  <div className="text-3xl font-mono font-bold text-primary">
                    {quantumState?.H.toFixed(6) || "—"}
                  </div>
                </div>
                <div className="glass rounded-xl p-6 border border-secondary/30 text-center">
                  <h4 className="text-sm text-muted-foreground mb-2">N (Navigation)</h4>
                  <div className="text-3xl font-mono font-bold text-secondary">
                    {quantumState?.N.toFixed(6) || "—"}
                  </div>
                </div>
                <div className="glass rounded-xl p-6 border border-accent/30 text-center">
                  <h4 className="text-sm text-muted-foreground mb-2">G (Wachstum)</h4>
                  <div className="text-3xl font-mono font-bold text-accent">
                    {quantumState?.G.toFixed(6) || "—"}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={runSimulation} 
                  disabled={isAnimating}
                  className="gap-2"
                  variant="default"
                >
                  <Zap className="w-5 h-5" />
                  {isAnimating ? "Simulation läuft..." : "Vorwärts-Iteration starten"}
                </Button>
              </div>

              <div className="glass rounded-xl p-6 border border-primary/20">
                <h4 className="font-semibold mb-4">System-Gleichungen</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
                  <code className="bg-background/50 p-3 rounded block">
                    H(t+1) = H(t) + αN(t) - βG(t)
                  </code>
                  <code className="bg-background/50 p-3 rounded block">
                    N(t+1) = γN(t) + δ|H(t)|·sgn(H(t))
                  </code>
                  <code className="bg-background/50 p-3 rounded block">
                    G(t+1) = G(t) + η(H+N)(1+0.01·tanh(G/10))
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeModule === "crypto" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-accent/20 rounded-xl">
                  <Lock className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Crypto Lab</h3>
                  <p className="text-muted-foreground">ECDSA secp256k1, Bitcoin-Adressen & Chaos-Theorie</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-accent">Kryptographische Primitive</h4>
                  <div className="space-y-3">
                    {[
                      { name: "ECDSA secp256k1", desc: "Bitcoin-Signatur-Algorithmus" },
                      { name: "SHA-256", desc: "Kryptographische Hash-Funktion" },
                      { name: "RIPEMD-160", desc: "Adress-Generierung" },
                      { name: "Base58Check", desc: "Bitcoin-Adress-Encoding" },
                    ].map((item, idx) => (
                      <div key={idx} className="glass rounded-lg p-4 border border-accent/20 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-primary">Chaos-Theorie-Integration</h4>
                  <div className="glass rounded-xl p-6 border border-primary/30">
                    <h5 className="font-semibold mb-3">Lorenz-Attraktor</h5>
                    <code className="text-xs text-muted-foreground block bg-background/50 p-3 rounded mb-4">
                      dx/dt = σ(y-x)<br/>
                      dy/dt = x(ρ-z) - y<br/>
                      dz/dt = xy - βz
                    </code>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-primary/20 rounded text-primary">σ = 10</span>
                      <span className="px-2 py-1 bg-secondary/20 rounded text-secondary">ρ = 28</span>
                      <span className="px-2 py-1 bg-accent/20 rounded text-accent">β = 8/3</span>
                    </div>
                  </div>
                  
                  <div className="glass rounded-xl p-6 border border-secondary/30">
                    <h5 className="font-semibold mb-3">Mandelbrot-Set-Generator</h5>
                    <code className="text-xs text-muted-foreground block bg-background/50 p-3 rounded">
                      zₙ₊₁ = zₙ² + c, wobei z₀ = 0, c ∈ ℂ
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "metamatrix" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-success/20 rounded-xl">
                  <Binary className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Meta-Matrix System</h3>
                  <p className="text-muted-foreground">12 Mathematische Archetypen & 7-Schicht-Architektur</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { name: "Null", symbol: "0", desc: "Absolute Leere" },
                  { name: "Eins", symbol: "1", desc: "Ursprung der Existenz" },
                  { name: "Phi", symbol: "φ", desc: "Goldener Schnitt" },
                  { name: "Pi", symbol: "π", desc: "Kreiszahl" },
                  { name: "e", symbol: "e", desc: "Euler-Zahl" },
                  { name: "i", symbol: "i", desc: "Imaginäre Einheit" },
                  { name: "∞", symbol: "∞", desc: "Unendlichkeit" },
                  { name: "Aleph", symbol: "ℵ₀", desc: "Abzählbare Unendlichkeit" },
                  { name: "Gamma", symbol: "γ", desc: "Euler-Mascheroni" },
                  { name: "Zeta", symbol: "ζ(3)", desc: "Apéry-Konstante" },
                  { name: "Delta", symbol: "δ", desc: "Feigenbaum-Konstante" },
                  { name: "Omega", symbol: "Ω", desc: "Chaitin-Konstante" },
                ].map((archetype, idx) => (
                  <div key={idx} className="glass rounded-xl p-4 border border-success/20 text-center hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold text-success mb-1">{archetype.symbol}</div>
                    <p className="text-sm font-semibold">{archetype.name}</p>
                    <p className="text-xs text-muted-foreground">{archetype.desc}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl p-6 border border-primary/20">
                <h4 className="font-semibold mb-4">7-Schicht-Architektur</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Axiomatische Basis",
                    "Algebraische Strukturen",
                    "Topologische Räume",
                    "Differentialgeometrie",
                    "Quantenformulierung",
                    "Informationstheorie",
                    "Bewusstseins-Integration",
                  ].map((layer, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium"
                      style={{ opacity: 1 - idx * 0.1 }}
                    >
                      {idx + 1}. {layer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeModule === "cosmology" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/20 rounded-xl">
                  <Infinity className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Fraktal-Kosmologie</h3>
                  <p className="text-muted-foreground">45°-Rotation, Mandelbrot-Kosmos & Universelle Kohärenz</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-primary">Universal Coherence Factor</h4>
                  <div className="glass rounded-xl p-8 border border-primary/30 text-center">
                    <div className="text-5xl font-mono font-bold text-gradient mb-2">
                      {ucf.toFixed(8)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maß für kosmische Harmonie
                    </p>
                  </div>
                  
                  <div className="glass rounded-xl p-6 border border-accent/30">
                    <h5 className="font-semibold mb-3">Kosmologische Iteration</h5>
                    <code className="text-sm text-muted-foreground block bg-background/50 p-3 rounded">
                      Ψₙ₊₁ = R(45°) · Ψₙ² + Cᵥₐc
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-secondary">45°-Rotationsmatrix</h4>
                  <div className="glass rounded-xl p-6 border border-secondary/30">
                    <div className="grid grid-cols-2 gap-2 font-mono text-center">
                      <div className="bg-background/50 p-3 rounded">
                        <span className="text-secondary">1/√2</span>
                      </div>
                      <div className="bg-background/50 p-3 rounded">
                        <span className="text-secondary">-1/√2</span>
                      </div>
                      <div className="bg-background/50 p-3 rounded">
                        <span className="text-secondary">1/√2</span>
                      </div>
                      <div className="bg-background/50 p-3 rounded">
                        <span className="text-secondary">1/√2</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      R(45°) = cos(π/4)·I + sin(π/4)·J
                    </p>
                  </div>
                  
                  <div className="glass rounded-xl p-6 border border-success/30">
                    <h5 className="font-semibold mb-3">Mandelbrot-Dimension</h5>
                    <div className="flex items-center gap-4">
                      <Waves className="w-8 h-8 text-success" />
                      <div>
                        <div className="text-2xl font-mono font-bold text-success">D ≈ 2.0</div>
                        <p className="text-xs text-muted-foreground">Hausdorff-Dimension der Grenze</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Integration Note */}
        <div className="mt-12 glass rounded-2xl p-8 border border-primary/20 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gradient">Vollständig Integriertes System</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Alle 5 Module sind mathematisch miteinander verknüpft und bilden die 
            <strong className="text-foreground"> Lex Universalis</strong> – den Master-Algorithmus des Kosmos.
            Jeder Schritt ist nachvollziehbar, jede Gleichung ist bewiesen, jede Berechnung ist reversibel.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OmniGenesisShowcase;
