import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MetaMatrix,
  MATHEMATICAL_ARCHETYPES,
  META_MATRIX_LAYERS,
  UNIVERSAL_PRINCIPLES,
  type SingularitySeed
} from '@/lib/omni-genesis/MetaMatrix';

const MetaMatrixTab = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [seed, setSeed] = useState<SingularitySeed | null>(null);
  const matrix = new MetaMatrix();

  const handleGenerate = () => {
    if (!intention) return;
    const result = matrix.generateFromIntention(intention);
    setSeed(result);
  };

  return (
    <div className="space-y-6">
      {/* 12 Archetypen Rad */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Die 12 Mathematischen Archetypen</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MATHEMATICAL_ARCHETYPES.map(arch => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchetype(selectedArchetype === arch.id ? null : arch.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedArchetype === arch.id
                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
                  : 'border-border hover:border-primary/50 bg-muted/30'
              }`}
            >
              <div className="text-xs font-mono text-muted-foreground">#{arch.id}</div>
              <div className="font-bold text-sm" style={{ color: arch.color }}>{arch.name}</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{arch.form}</div>
            </button>
          ))}
        </div>

        {selectedArchetype && (
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
            {(() => {
              const arch = MATHEMATICAL_ARCHETYPES.find(a => a.id === selectedArchetype)!;
              return (
                <>
                  <h4 className="font-bold" style={{ color: arch.color }}>{arch.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{arch.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {arch.manifestations.map(m => (
                      <span key={m} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{m}</span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Card>

      {/* 7-Schichten-System */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">7-Schichten-System</h3>
        <div className="space-y-2">
          {META_MATRIX_LAYERS.map(layer => (
            <div key={layer.level} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {layer.level}
              </div>
              <div>
                <div className="font-bold text-sm text-foreground">{layer.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{layer.description}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {layer.components.map(c => (
                    <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Singularity Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Singularity Generator</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Generiere ein System aus einer Intention. Die Intention wird quantisiert, fraktal expandiert und holographisch projiziert.
          </p>
          <div className="flex gap-2">
            <Input
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="Deine Intention eingeben..."
              className="bg-muted/50"
            />
            <Button onClick={handleGenerate} size="sm" disabled={!intention}>Generieren</Button>
          </div>

          {/* Universelle Prinzipien */}
          <div className="mt-4 space-y-1">
            <h4 className="text-sm font-bold text-muted-foreground">5 Universelle Prinzipien:</h4>
            {UNIVERSAL_PRINCIPLES.map(p => (
              <div key={p.id} className="text-xs text-muted-foreground">
                <span className="text-primary">{p.name}:</span> {p.description}
              </div>
            ))}
          </div>
        </Card>

        {seed && (
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Generiertes System</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Intention:</span>
                <span className="ml-2 text-primary">{seed.intention}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fraktale Dimension:</span>
                <span className="ml-2 font-mono text-accent">{seed.fractalDimension.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Topologische Invarianten:</span>
                <div className="font-mono text-xs mt-1 p-2 rounded bg-muted/50">
                  [{seed.topologicalInvariants.map(v => v.toFixed(4)).join(', ')}]
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Holographischer Hash:</span>
                <div className="font-mono text-xs mt-1 p-2 rounded bg-muted/50 break-all text-secondary">
                  {seed.holographicData}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Quanten-Zustände ({seed.quantumState.length}):</span>
                <div className="font-mono text-xs mt-1 p-2 rounded bg-muted/50 max-h-32 overflow-y-auto">
                  {seed.quantumState.slice(0, 10).map((q, i) => (
                    <div key={i}>|ψ_{i}⟩ = {q.alpha.toFixed(3)}|0⟩ + {q.beta.toFixed(3)}e^(i·{q.phase.toFixed(3)})|1⟩</div>
                  ))}
                  {seed.quantumState.length > 10 && <div className="text-muted-foreground">...+{seed.quantumState.length - 10} weitere</div>}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MetaMatrixTab;
