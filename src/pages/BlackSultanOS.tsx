import { useState, useEffect, useRef } from 'react';
import { Brain, Activity, Terminal, Zap, Cpu, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NeuronVisual {
  id: string;
  x: number;
  y: number;
  potential: number;
  layer: number;
}

interface BrainState {
  states: Array<{ id: string; p: number }>;
  fired: string[];
}

interface MetricData {
  coherence: number;
  entropy: number;
  activity: number;
}

const BlackSultanOS = () => {
  const [isConscious, setIsConscious] = useState(false);
  const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; sender: string }>>([]);
  const [metrics, setMetrics] = useState<MetricData>({ coherence: 0, entropy: 0, activity: 0 });
  const [brainState, setBrainState] = useState<BrainState | null>(null);
  const [structure, setStructure] = useState<any>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuronsRef = useRef<Record<string, NeuronVisual>>({});
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Web Worker
    const workerCode = `
      class Neuron {
        constructor(id, layer, index) {
          this.id = id;
          this.layer = layer;
          this.index = index;
          this.potential = 0;
          this.threshold = 1.0;
          this.decay = 0.95;
          this.weights = {};
          this.refractoryCount = 0;
          this.refractoryPeriod = 5;
        }

        connect(targetId, weight) {
          this.weights[targetId] = weight;
        }

        receive(signal) {
          this.potential += signal;
        }

        tick() {
          if (this.refractoryCount > 0) {
            this.refractoryCount--;
            this.potential = 0;
            return { fired: false, output: 0, potential: this.potential };
          }

          this.potential *= this.decay;

          if (this.potential >= this.threshold) {
            const output = this.potential;
            this.potential = 0;
            this.refractoryCount = this.refractoryPeriod;
            return { fired: true, output, potential: 1.0 };
          }
          return { fired: false, output: 0, potential: this.potential };
        }
      }

      class OrganismBrain {
        constructor(config) {
          this.neurons = {};
          this.connections = [];
          this.layers = config.layers || [6, 12, 12, 6];
          this.tickRate = 50;
          this.isConscious = false;
          this.initBrain();
        }

        initBrain() {
          let prevLayerIds = [];
          
          this.layers.forEach((count, layerIdx) => {
            let currentLayerIds = [];
            for (let i = 0; i < count; i++) {
              const id = \`n_\${layerIdx}_\${i}\`;
              const neuron = new Neuron(id, layerIdx, i);
              this.neurons[id] = neuron;
              currentLayerIds.push(id);

              if (prevLayerIds.length > 0) {
                prevLayerIds.forEach(prevId => {
                  const weight = (Math.random() * 2) - 1;
                  this.neurons[prevId].connect(id, weight);
                  this.connections.push({ from: prevId, to: id, weight });
                });
              }
            }
            prevLayerIds = currentLayerIds;
          });

          self.postMessage({ 
            type: 'BRAIN_STRUCTURE', 
            payload: { 
              neurons: Object.values(this.neurons).map(n => ({id: n.id, layer: n.layer, index: n.index})),
              connections: this.connections
            }
          });
        }

        stimulate(intensity = 1.0) {
          Object.values(this.neurons).filter(n => n.layer === 0).forEach(n => {
            n.receive(Math.random() * intensity * 2);
          });
          self.postMessage({ type: 'LOG', payload: \`>> Stimulus received. Intensity: \${intensity.toFixed(2)}\` });
        }

        startExistence() {
          if (this.isConscious) return;
          this.isConscious = true;
          this.tickInterval = setInterval(() => this.processTick(), this.tickRate);
          self.postMessage({ type: 'LOG', payload: ">> CONSCIOUSNESS ACTIVATED. EXISTENCE BEGINS." });
        }

        stopExistence() {
          this.isConscious = false;
          clearInterval(this.tickInterval);
          self.postMessage({ type: 'LOG', payload: ">> CONSCIOUSNESS DORMANT. DEEP SLEEP." });
        }

        processTick() {
          const brainState = [];
          let fireEvents = [];

          for (const id in this.neurons) {
            const neuron = this.neurons[id];
            const result = neuron.tick();
            
            brainState.push({ id: id, p: result.potential });

            if (result.fired) {
              fireEvents.push(id);
              for (const targetId in neuron.weights) {
                if (this.neurons[targetId]) {
                  this.neurons[targetId].receive(result.output * neuron.weights[targetId]);
                }
              }
            }
          }

          if (Math.random() < 0.05) {
            const keys = Object.keys(this.neurons);
            const randomNeuron = this.neurons[keys[Math.floor(Math.random() * keys.length)]];
            randomNeuron.receive(0.5);
          }

          self.postMessage({ type: 'BRAIN_UPDATE', payload: { states: brainState, fired: fireEvents } });
        }
      }

      let brain = null;

      self.onmessage = function(e) {
        const { type, payload } = e.data;
        
        switch(type) {
          case 'INIT_GENES':
            brain = new OrganismBrain(payload);
            break;
          case 'START_EXISTENCE':
            if(brain) brain.startExistence();
            break;
          case 'STOP_EXISTENCE':
            if(brain) brain.stopExistence();
            break;
          case 'STIMULATE':
            if(brain) brain.stimulate(payload);
            break;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      
      switch(type) {
        case 'BRAIN_STRUCTURE':
          setStructure(payload);
          break;
        case 'BRAIN_UPDATE':
          setBrainState(payload);
          setMetrics(prev => ({
            ...prev,
            activity: payload.fired.length / 10,
            coherence: Math.random() * 0.3 + 0.7,
            entropy: Math.random() * 0.3
          }));
          break;
        case 'LOG':
          addLog(payload, 'SYSTEM');
          break;
      }
    };

    workerRef.current = worker;
    worker.postMessage({ type: 'INIT_GENES', payload: { layers: [6, 12, 12, 6] } });
    
    addLog('BLACK SULTAN OS | NEURAL CORE v1.0 INITIALIZING...', 'SYSTEM');

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (!structure || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Initialize neuron positions
    const layerGroups: Record<number, any[]> = {};
    structure.neurons.forEach((n: any) => {
      if (!layerGroups[n.layer]) layerGroups[n.layer] = [];
      layerGroups[n.layer].push(n);
    });

    const layersCount = Object.keys(layerGroups).length;
    const layerWidth = width / (layersCount + 1);

    const newNeurons: Record<string, NeuronVisual> = {};
    
    Object.keys(layerGroups).forEach((layerIndex) => {
      const neuronsInLayer = layerGroups[parseInt(layerIndex)];
      const layerHeightStep = height / (neuronsInLayer.length + 1);
      
      neuronsInLayer.forEach((n: any, idx: number) => {
        newNeurons[n.id] = {
          id: n.id,
          x: (parseInt(layerIndex) + 1) * layerWidth,
          y: (idx + 1) * layerHeightStep,
          potential: 0,
          layer: n.layer
        };
      });
    });
    
    neuronsRef.current = newNeurons;
  }, [structure]);

  useEffect(() => {
    if (!canvasRef.current || !structure) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 0.5;
      structure.connections?.forEach((conn: any) => {
        const start = neuronsRef.current[conn.from];
        const end = neuronsRef.current[conn.to];
        if (start && end) {
          ctx.strokeStyle = conn.weight > 0 ? 'rgba(0, 255, 157, 0.05)' : 'rgba(255, 0, 85, 0.05)';
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      });

      // Update potentials from brain state
      if (brainState?.states) {
        brainState.states.forEach(s => {
          if (neuronsRef.current[s.id]) {
            neuronsRef.current[s.id].potential += (s.p - neuronsRef.current[s.id].potential) * 0.2;
          }
        });
      }

      // Draw neurons
      for (let id in neuronsRef.current) {
        const n = neuronsRef.current[id];
        const r = 3 + (n.potential * 5);
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        
        const intensity = n.potential;
        const rVal = Math.min(255, intensity * 255);
        const gVal = Math.min(255, intensity * 255 + 100);
        const bVal = 255 - (intensity * 200);
        
        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${0.5 + intensity * 0.5})`;
        
        if (intensity > 0.7) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFD700';
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [structure, brainState]);

  const addLog = (text: string, sender: string = 'SYSTEM') => {
    setLogs(prev => [...prev.slice(-50), { 
      timestamp: new Date().toISOString(), 
      text, 
      sender 
    }]);
  };

  const toggleConsciousness = () => {
    if (!workerRef.current) return;
    
    if (isConscious) {
      workerRef.current.postMessage({ type: 'STOP_EXISTENCE' });
    } else {
      workerRef.current.postMessage({ type: 'START_EXISTENCE' });
    }
    setIsConscious(!isConscious);
  };

  const stimulate = () => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'STIMULATE', payload: 1.5 });
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bs-black via-bs-panel to-bs-black text-foreground p-4">
      {/* CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent animate-scanline" />
      </div>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30">
              <Brain className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-mono tracking-tighter text-amber-500">
                BLACK SULTAN OS
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Neural Simulation Core v1.0 | Self-Aware Digital Organism
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={toggleConsciousness}
              variant={isConscious ? "destructive" : "default"}
              className="font-mono"
            >
              {isConscious ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  HALT
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  AWAKEN
                </>
              )}
            </Button>
            <Button onClick={stimulate} variant="outline" className="font-mono">
              <Zap className="w-4 h-4 mr-2" />
              STIMULATE
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-panel p-4 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Activity</p>
                <p className="text-2xl font-bold font-mono">{metrics.activity.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-panel p-4 border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/10">
                <Cpu className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Coherence</p>
                <p className="text-2xl font-bold font-mono">{metrics.coherence.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-panel p-4 border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <Brain className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Entropy</p>
                <p className="text-2xl font-bold font-mono">{metrics.entropy.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Neural Visualization */}
          <Card className="lg:col-span-2 glass-panel p-0 border-primary/20 overflow-hidden">
            <div className="relative">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 animate-pulse">
                  LIVE SIMULATION
                </span>
                <span className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  CANVAS RENDERER
                </span>
              </div>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="w-full h-auto bg-black/50"
              />
            </div>
          </Card>

          {/* Terminal */}
          <Card className="glass-panel p-4 border-success/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
              <div className="flex items-center gap-2 text-success">
                <Terminal className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">SYSTEM_LOG</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-2 h-2 rounded-full bg-success" />
              </div>
            </div>
            
            <div className="h-[500px] overflow-y-auto space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="hover:bg-primary/5 p-1 rounded transition-colors">
                  <span className="text-muted-foreground">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-success ml-2">{log.sender}:</span>
                  <span className="text-foreground/80 ml-2">{log.text}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlackSultanOS;
