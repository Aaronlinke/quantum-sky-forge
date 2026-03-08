import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { QuantumVacuumSymmetryBreaker, type VacuumFluctuationResult, type VacuumStatus } from '@/lib/omni-genesis/QuantumVacuum';

const QuantumVacuumTab = () => {
  const [frequency, setFrequency] = useState(1.0);
  const [result, setResult] = useState<VacuumFluctuationResult | null>(null);
  const [status, setStatus] = useState<VacuumStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vacuumRef = useRef(new QuantumVacuumSymmetryBreaker());
  const animFrameRef = useRef<number>(0);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = 'hsl(220, 20%, 8%)';
    ctx.fillRect(0, 0, w, h);

    const particles = vacuumRef.current.getParticlesForVisualization();
    particles.forEach(p => {
      const x = p.position.x * w;
      const y = p.position.y * h;
      const radius = Math.max(1, Math.abs(p.energy) * 4);
      const alpha = Math.max(0.2, Math.min(1, Math.abs(p.energy)));

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (p.type === 'particle') {
        ctx.fillStyle = `hsla(192, 100%, 50%, ${alpha})`;
        ctx.shadowColor = 'hsl(192, 100%, 50%)';
      } else {
        ctx.fillStyle = `hsla(270, 65%, 60%, ${alpha})`;
        ctx.shadowColor = 'hsl(270, 65%, 60%)';
      }
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const runSimulation = useCallback(() => {
    const res = vacuumRef.current.modulateFluctuations(frequency);
    setResult(res);
    setStatus(vacuumRef.current.getVacuumStatus());
    drawParticles();

    if (isRunning) {
      animFrameRef.current = requestAnimationFrame(runSimulation);
    }
  }, [frequency, isRunning, drawParticles]);

  useEffect(() => {
    if (isRunning) {
      animFrameRef.current = requestAnimationFrame(runSimulation);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning, runSimulation]);

  useEffect(() => {
    drawParticles();
  }, [drawParticles]);

  const handleSingleStep = () => {
    const res = vacuumRef.current.modulateFluctuations(frequency);
    setResult(res);
    setStatus(vacuumRef.current.getVacuumStatus());
    drawParticles();
  };

  const handleReset = () => {
    setIsRunning(false);
    cancelAnimationFrame(animFrameRef.current);
    vacuumRef.current.reset();
    setResult(null);
    setStatus(vacuumRef.current.getVacuumStatus());
    drawParticles();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Canvas */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">Vakuum-Visualisierung</h3>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full rounded-lg border border-border"
        />
        <p className="text-xs text-muted-foreground mt-2">
          <span className="text-primary">●</span> Teilchen &nbsp;
          <span className="text-secondary">●</span> Antiteilchen
        </p>
      </Card>

      {/* Steuerung */}
      <div className="space-y-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">Parameter</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Frequenz: {frequency.toFixed(2)}</label>
              <Slider
                value={[frequency]}
                onValueChange={([v]) => setFrequency(v)}
                min={0.1}
                max={10}
                step={0.1}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSingleStep} variant="outline" size="sm">Einzelschritt</Button>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                size="sm"
                className={isRunning ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                {isRunning ? 'Stopp' : 'Simulation starten'}
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">Reset</Button>
            </div>
          </div>
        </Card>

        {/* Ergebnisse */}
        {result && (
          <Card className="p-4 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Ergebnisse</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Neue Teilchen:</span>
                <span className="ml-2 text-primary font-mono">{result.particleCreation.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Energie-Extraktion:</span>
                <span className="ml-2 text-primary font-mono">{result.energyExtraction.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quanten-Kohärenz:</span>
                <span className="ml-2 text-primary font-mono">{result.quantumCoherence.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Realitäts-Shift:</span>
                <span className="ml-2 text-accent font-mono">{result.realityShift.toFixed(8)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hawking-Strahlung:</span>
                <span className="ml-2 text-secondary font-mono">{result.hawkingRadiation.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bewusstseins-Emergenz:</span>
                <span className="ml-2 text-accent font-mono">{result.consciousnessEmerge.toFixed(8)}</span>
              </div>
            </div>
          </Card>
        )}

        {status && (
          <Card className="p-4 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Vakuum-Status</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nullpunktenergie:</span>
                <span className="ml-2 font-mono">{status.zeroPointEnergy.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Virtuelle Teilchen:</span>
                <span className="ml-2 font-mono">{status.virtualParticles}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Casimir-Druck:</span>
                <span className="ml-2 font-mono">{status.casimirPressure.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quanten-Schaum:</span>
                <span className="ml-2 font-mono">{status.quantumFoamDensity}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuantumVacuumTab;
