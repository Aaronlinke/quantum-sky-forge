import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  MathematicalTimeMachine,
  type TimeMachineState,
  type RoundTripResult
} from '@/lib/omni-genesis/MathematicalTimeMachine';
import { INITIAL_STATE } from '@/lib/omni-genesis/OmniGenesisCore';

const TimeMachineTab = () => {
  const [alpha, setAlpha] = useState(0.245);
  const [beta, setBeta] = useState(0.152);
  const [gamma, setGamma] = useState(0.985);
  const [delta, setDelta] = useState(0.112);
  const [eta, setEta] = useState(0.088);
  const [steps, setSteps] = useState(5);
  const [states, setStates] = useState<TimeMachineState[]>([]);
  const [roundTrip, setRoundTrip] = useState<RoundTripResult | null>(null);
  const [useCalibrated, setUseCalibrated] = useState(false);

  const handleEvolve = () => {
    const tm = new MathematicalTimeMachine(useCalibrated);
    const result = tm.evolve(INITIAL_STATE, steps);
    setStates(result.states);
    setRoundTrip(null);
  };

  const handleRoundTrip = () => {
    const tm = new MathematicalTimeMachine(useCalibrated);
    const result = tm.performRoundTrip(INITIAL_STATE, steps);
    setStates(result.forward);
    setRoundTrip(result);
  };

  const chartData = states.map(s => ({
    t: s.t,
    H: parseFloat(s.H.toFixed(6)),
    N: parseFloat(s.N.toFixed(6)),
    G: parseFloat(s.G.toFixed(6)),
  }));

  return (
    <div className="space-y-6">
      {/* Parameter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">System-Koeffizienten</h3>
          <div className="space-y-3">
            {[
              { label: 'α (H-N Kopplung)', value: alpha, set: setAlpha, min: 0, max: 1 },
              { label: 'β (H-G Dämpfung)', value: beta, set: setBeta, min: 0, max: 1 },
              { label: 'γ (N-Drift)', value: gamma, set: setGamma, min: 0.5, max: 2 },
              { label: 'δ (H-N Rückkopplung)', value: delta, set: setDelta, min: 0, max: 1 },
              { label: 'η (Wachstumsimpuls)', value: eta, set: setEta, min: 0, max: 0.5 },
            ].map(p => (
              <div key={p.label}>
                <label className="text-sm text-muted-foreground">{p.label}: {p.value.toFixed(3)}</label>
                <Slider value={[p.value]} onValueChange={([v]) => p.set(v)} min={p.min} max={p.max} step={0.001} className="mt-1" />
              </div>
            ))}
            <div>
              <label className="text-sm text-muted-foreground">Schritte: {steps}</label>
              <Slider value={[steps]} onValueChange={([v]) => setSteps(v)} min={1} max={50} step={1} className="mt-1" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Initialbedingungen (t=0)</h3>
          <div className="space-y-2 font-mono text-sm">
            <div>H(0) = <span className="text-primary">{INITIAL_STATE.H}</span></div>
            <div>N(0) = <span className="text-primary">{INITIAL_STATE.N}</span></div>
            <div>G(0) = <span className="text-primary">{INITIAL_STATE.G}</span></div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground font-mono">
            <div>H(t+1) = H(t) + α·N(t) - β·G(t) + ε_H(t)</div>
            <div>N(t+1) = γ·N(t) + δ·|H(t)|·sgn(H(t)) + ε_N(t)</div>
            <div>G(t+1) = G(t) + η·[H(t+1)+N(t+1)]·[1+0.01·tanh(G/10)] + ε_G(t)</div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button onClick={handleEvolve} size="sm">Vorwärts berechnen</Button>
            <Button onClick={handleRoundTrip} variant="outline" size="sm">Rundreise T=0→{steps}→0</Button>
            <Button
              onClick={() => setUseCalibrated(!useCalibrated)}
              variant="outline"
              size="sm"
              className={useCalibrated ? 'border-accent text-accent' : ''}
            >
              {useCalibrated ? 'Kalibriert (γ=1.1487)' : 'Standard (γ=0.985)'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">Zeitentwicklung H(t), N(t), G(t)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 20%)" />
              <XAxis dataKey="t" stroke="hsl(200, 10%, 65%)" label={{ value: 'Zeit t', position: 'bottom' }} />
              <YAxis stroke="hsl(200, 10%, 65%)" />
              <Tooltip contentStyle={{ background: 'hsl(225, 15%, 12%)', border: '1px solid hsl(225, 20%, 20%)' }} />
              <Legend />
              <Line type="monotone" dataKey="H" stroke="hsl(192, 100%, 42%)" strokeWidth={2} name="H (Harmonisch)" dot />
              <Line type="monotone" dataKey="N" stroke="hsl(270, 65%, 60%)" strokeWidth={2} name="N (Navigation)" dot />
              <Line type="monotone" dataKey="G" stroke="hsl(32, 100%, 50%)" strokeWidth={2} name="G (Wachstum)" dot />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Zustandstabelle */}
      {states.length > 0 && (
        <Card className="p-4 bg-card border-border overflow-x-auto">
          <h3 className="text-lg font-bold text-foreground mb-3">Zustandssequenz</h3>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted-foreground">t</th>
                <th className="text-right p-2 text-primary">H(t)</th>
                <th className="text-right p-2 text-secondary">N(t)</th>
                <th className="text-right p-2 text-accent">G(t)</th>
              </tr>
            </thead>
            <tbody>
              {states.map(s => (
                <tr key={s.t} className="border-b border-border/50">
                  <td className="p-2">{s.t}</td>
                  <td className="text-right p-2">{s.H.toFixed(6)}</td>
                  <td className="text-right p-2">{s.N.toFixed(6)}</td>
                  <td className="text-right p-2">{s.G.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Rundreise-Ergebnis */}
      {roundTrip && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-3">Rundreise-Validierung</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Gesamt-Fehler:</span>
              <span className={`ml-2 font-mono ${roundTrip.isConsistent ? 'text-green-400' : 'text-destructive'}`}>
                {roundTrip.error.toExponential(4)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Konsistent:</span>
              <span className={`ml-2 font-bold ${roundTrip.isConsistent ? 'text-green-400' : 'text-destructive'}`}>
                {roundTrip.isConsistent ? '✓ Ja' : '✗ Nein'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Validierungs-Hash:</span>
              <span className="ml-2 font-mono text-primary">{roundTrip.validationHash}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TimeMachineTab;
