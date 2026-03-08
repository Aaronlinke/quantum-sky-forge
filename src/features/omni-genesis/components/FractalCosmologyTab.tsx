import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FractalCosmology, COSMIC_LAYERS, type RotationResult } from '@/lib/omni-genesis/FractalCosmology';

const FractalCosmologyTab = () => {
  const [vacReal, setVacReal] = useState(0.3);
  const [vacImag, setVacImag] = useState(0.5);
  const [maxIter, setMaxIter] = useState(50);
  const [result, setResult] = useState<RotationResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(false);

  const handleIterate = () => {
    const fc = new FractalCosmology(vacReal, vacImag);
    const res = fc.iterate(0.1, 0.1, maxIter);
    setResult(res);
  };

  const renderMandelbrot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setRendering(true);
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const fc = new FractalCosmology();
    const iter = Math.min(maxIter, 40);

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const x = -2.5 + 4 * px / w;
        const y = -2 + 4 * py / h;
        fc.setVacuumConstant(x, y);
        const res = fc.iterate(0, 0, iter);
        const idx = (py * w + px) * 4;

        if (!res.diverged) {
          const coh = res.finalState.coherence;
          imageData.data[idx] = Math.floor(coh * 30);
          imageData.data[idx + 1] = Math.floor(coh * 80);
          imageData.data[idx + 2] = Math.floor(coh * 120);
        } else {
          const t = res.escapeIteration / iter;
          // Cyan-purple-orange palette
          imageData.data[idx] = Math.floor(Math.sin(t * Math.PI) * 200);
          imageData.data[idx + 1] = Math.floor(Math.sin(t * Math.PI * 0.7) * 150);
          imageData.data[idx + 2] = Math.floor(Math.cos(t * Math.PI * 0.5) * 255);
        }
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Overlay text
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.6)';
    ctx.font = '11px monospace';
    ctx.fillText('Ψₙ₊₁ = R(45°) · Ψₙ² + Cᵥₐc', 10, 20);
    setRendering(false);
  }, [maxIter]);

  useEffect(() => {
    renderMandelbrot();
  }, [renderMandelbrot]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canvas */}
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">45°-Rotiertes Mandelbrot-Set</h3>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full rounded-lg border border-border"
          />
          <Button onClick={renderMandelbrot} variant="outline" size="sm" className="mt-2" disabled={rendering}>
            {rendering ? 'Rendere...' : 'Neu rendern'}
          </Button>
        </Card>

        {/* Steuerung + Iteration */}
        <div className="space-y-4">
          <Card className="p-4 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Kosmologischer Operator</h3>
            <div className="p-3 rounded bg-muted/50 font-mono text-sm text-center mb-4">
              Ψ<sub>n+1</sub> = R(45°) · Ψ<sub>n</sub>² + C<sub>vac</sub>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">C_vac Real: {vacReal.toFixed(2)}</label>
                <Slider value={[vacReal]} onValueChange={([v]) => setVacReal(v)} min={-2} max={2} step={0.01} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">C_vac Imag: {vacImag.toFixed(2)}</label>
                <Slider value={[vacImag]} onValueChange={([v]) => setVacImag(v)} min={-2} max={2} step={0.01} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Max. Iterationen: {maxIter}</label>
                <Slider value={[maxIter]} onValueChange={([v]) => setMaxIter(v)} min={10} max={200} step={5} className="mt-1" />
              </div>
              <Button onClick={handleIterate} size="sm">Iterieren</Button>
            </div>
          </Card>

          {result && (
            <Card className="p-4 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-3">Iterations-Ergebnis</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Divergiert:</span>
                  <span className={`ml-2 font-bold ${result.diverged ? 'text-destructive' : 'text-green-400'}`}>
                    {result.diverged ? `Ja (n=${result.escapeIteration})` : 'Nein (stabil)'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Endzustand:</span>
                  <span className="ml-2 font-mono text-primary text-xs">
                    {result.finalState.real.toFixed(4)} + {result.finalState.imag.toFixed(4)}i
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Kohärenz (UCF):</span>
                  <span className="ml-2 font-mono text-accent">{result.finalState.coherence.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Schritte:</span>
                  <span className="ml-2 font-mono">{result.states.length}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Kosmische Ebenen */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Kosmische Ebenen des Mandelbrot-Kosmos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {COSMIC_LAYERS.map((layer, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/50">
              <div className="text-xs text-primary font-mono">{layer.scale}</div>
              <div className="font-bold text-sm text-foreground">{layer.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{layer.description}</div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${layer.ucf * 100}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">UCF: {layer.ucf}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FractalCosmologyTab;
