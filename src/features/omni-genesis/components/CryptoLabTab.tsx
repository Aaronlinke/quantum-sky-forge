import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CryptoLab, type KeyPair } from '@/lib/omni-genesis/CryptoLab';

const CryptoLabTab = () => {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [chaosR, setChaosR] = useState(3.99);
  const [chaosResult, setChaosResult] = useState<{ lyapunov: number; dimension: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateKey = () => {
    setGenerating(true);
    setTimeout(() => {
      const kp = CryptoLab.generateKeyPair();
      setKeyPair(kp);
      setGenerating(false);
    }, 10);
  };

  const handleSign = async () => {
    if (!keyPair || !message) return;
    const sig = await CryptoLab.signMessage(message, keyPair.privateKey);
    setSignature(sig);
  };

  const handleChaos = () => {
    const result = CryptoLab.chaosLogisticMap(0.1, chaosR, 500);
    const dim = CryptoLab.calculateFractalDimension(result.sequence);
    setChaosResult({ lyapunov: result.lyapunovExponent, dimension: dim });
  };

  // Draw Mandelbrot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const x = -2.5 + 3.5 * px / w;
        const y = -1.5 + 3 * py / h;
        const iter = CryptoLab.mandelbrotFractal(x, y, 80);
        const idx = (py * w + px) * 4;

        if (iter === 80) {
          imageData.data[idx] = 10;
          imageData.data[idx + 1] = 10;
          imageData.data[idx + 2] = 20;
        } else {
          const t = iter / 80;
          imageData.data[idx] = Math.floor(9 * (1 - t) * t * t * t * 255);
          imageData.data[idx + 1] = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
          imageData.data[idx + 2] = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
        }
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Key Generation */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">ECDSA Schlüssel (secp256k1)</h3>
        <Button onClick={handleGenerateKey} size="sm" disabled={generating}>
          {generating ? 'Generiere...' : 'Neues Schlüsselpaar'}
        </Button>
        {keyPair && (
          <div className="mt-3 space-y-2 text-xs font-mono break-all">
            <div>
              <span className="text-destructive">Private Key:</span>
              <div className="p-2 rounded bg-muted/50 mt-1">{keyPair.privateKey}</div>
            </div>
            <div>
              <span className="text-primary">Public Key (komprimiert):</span>
              <div className="p-2 rounded bg-muted/50 mt-1">{keyPair.publicKeyCompressed}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Signatur */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">Nachricht signieren</h3>
        <div className="space-y-3">
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Nachricht eingeben..."
            className="bg-muted/50"
          />
          <Button onClick={handleSign} size="sm" disabled={!keyPair || !message}>Signieren</Button>
          {signature && (
            <div className="text-xs font-mono break-all">
              <span className="text-accent">Signatur:</span>
              <div className="p-2 rounded bg-muted/50 mt-1">{signature}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Mandelbrot */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">Mandelbrot-Kryptographie</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full rounded-lg border border-border"
        />
        <p className="text-xs text-muted-foreground mt-2">z_{'{n+1}'} = z_n² + c, z₀ = 0</p>
      </Card>

      {/* Chaos */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">Chaostheorie – Logistische Abbildung</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">r = {chaosR.toFixed(2)}</label>
            <Input
              type="number"
              value={chaosR}
              onChange={e => setChaosR(parseFloat(e.target.value) || 3.99)}
              step={0.01}
              min={2.5}
              max={4}
              className="bg-muted/50 mt-1"
            />
          </div>
          <Button onClick={handleChaos} size="sm">Berechnen</Button>
          {chaosResult && (
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">Lyapunov-Exponent:</span>
                <span className="ml-2 font-mono text-primary">{chaosResult.lyapunov.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fraktale Dimension:</span>
                <span className="ml-2 font-mono text-accent">{chaosResult.dimension.toFixed(4)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CryptoLabTab;
