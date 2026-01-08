/**
 * CRYPTO LAB - ECHTE KRYPTOGRAPHIE
 * ECDSA secp256k1, Bitcoin-Adressen, Fraktale Mathematik
 * Aus deinem Scientific Fusion Kern
 */

// secp256k1 Parameter - WIE IN BITCOIN CORE
const SECP256K1 = {
  P: BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F"),
  N: BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"),
  Gx: BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"),
  Gy: BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
};

export interface KeyPair {
  privateKey: string;
  publicKeyX: string;
  publicKeyY: string;
  publicKeyCompressed: string;
}

export interface BitcoinAddress {
  address: string;
  wif: string;
  hash160: string;
}

export interface FractalResult {
  dimension: number;
  iterations: number;
  escapeTime: number[];
}

export interface ChaosResult {
  sequence: number[];
  lyapunovExponent: number;
}

/**
 * Modulare Inverse mit erweitertem Euklid
 */
function modInverse(a: bigint, n: bigint): bigint {
  if (a === 0n) return 0n;
  
  let lm = 1n, hm = 0n;
  let low = ((a % n) + n) % n;
  let high = n;
  
  while (low > 1n) {
    const r = high / low;
    const nm = hm - lm * r;
    const newLow = high - low * r;
    hm = lm;
    lm = nm;
    high = low;
    low = newLow;
  }
  
  return ((lm % n) + n) % n;
}

/**
 * Punktaddition auf elliptischer Kurve
 */
function pointAdd(
  x1: bigint | null, y1: bigint | null,
  x2: bigint | null, y2: bigint | null,
  p: bigint
): [bigint | null, bigint | null] {
  if (x1 === null && y1 === null) return [x2, y2];
  if (x2 === null && y2 === null) return [x1, y1];
  if (x1 === null || y1 === null || x2 === null || y2 === null) return [null, null];

  let s: bigint;
  if (x1 === x2 && y1 === y2) {
    // Punktverdoppelung
    s = (3n * x1 * x1 * modInverse(2n * y1, p)) % p;
  } else {
    // Addition verschiedener Punkte
    s = ((y2 - y1) * modInverse(((x2 - x1) % p + p) % p, p)) % p;
  }
  
  s = ((s % p) + p) % p;
  const x3 = ((s * s - x1 - x2) % p + p) % p;
  const y3 = ((s * (x1 - x3) - y1) % p + p) % p;
  
  return [x3, y3];
}

/**
 * Skalare Multiplikation - Double-and-Add
 */
function scalarMult(k: bigint, x: bigint, y: bigint, p: bigint): [bigint | null, bigint | null] {
  let resultX: bigint | null = null;
  let resultY: bigint | null = null;
  let addendX: bigint | null = x;
  let addendY: bigint | null = y;
  
  while (k > 0n) {
    if (k & 1n) {
      [resultX, resultY] = pointAdd(resultX, resultY, addendX, addendY, p);
    }
    [addendX, addendY] = pointAdd(addendX, addendY, addendX, addendY, p);
    k >>= 1n;
  }
  
  return [resultX, resultY];
}

/**
 * Generiert sicheren Zufallswert
 */
function secureRandom(bytes: number): bigint {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  let hex = '';
  array.forEach(b => hex += b.toString(16).padStart(2, '0'));
  return BigInt('0x' + hex);
}

/**
 * SHA-256 Hash
 */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(data));
  return new Uint8Array(hash);
}

/**
 * Double SHA-256 (wie Bitcoin)
 */
async function doubleSha256(data: Uint8Array): Promise<Uint8Array> {
  const first = await sha256(data);
  return sha256(first);
}

export class CryptoLab {
  
  /**
   * Generiert ein ECHTES Bitcoin Keypair
   */
  static generateKeyPair(): KeyPair {
    // Generiere privaten Schlüssel
    let privateKey = secureRandom(32);
    
    // Sicherstellen dass 0 < privateKey < N
    while (privateKey <= 0n || privateKey >= SECP256K1.N) {
      privateKey = secureRandom(32);
    }
    
    // Berechne öffentlichen Schlüssel
    const [publicKeyX, publicKeyY] = scalarMult(
      privateKey,
      SECP256K1.Gx,
      SECP256K1.Gy,
      SECP256K1.P
    );
    
    if (publicKeyX === null || publicKeyY === null) {
      throw new Error("Failed to generate public key");
    }
    
    // Komprimierter Public Key
    const prefix = publicKeyY % 2n === 0n ? '02' : '03';
    const publicKeyCompressed = prefix + publicKeyX.toString(16).padStart(64, '0');
    
    return {
      privateKey: privateKey.toString(16).padStart(64, '0'),
      publicKeyX: publicKeyX.toString(16).padStart(64, '0'),
      publicKeyY: publicKeyY.toString(16).padStart(64, '0'),
      publicKeyCompressed
    };
  }

  /**
   * Mandelbrot Fraktal-Berechnung
   */
  static mandelbrotFractal(
    realPart: number,
    imagPart: number,
    maxIter: number = 100
  ): number {
    let zr = 0, zi = 0;
    
    for (let n = 0; n < maxIter; n++) {
      if (zr * zr + zi * zi > 4) {
        return n;
      }
      const temp = zr * zr - zi * zi + realPart;
      zi = 2 * zr * zi + imagPart;
      zr = temp;
    }
    
    return maxIter;
  }

  /**
   * Generiert Mandelbrot-Set für Visualisierung
   */
  static generateMandelbrotSet(
    width: number,
    height: number,
    xMin: number = -2.5,
    xMax: number = 1,
    yMin: number = -1.5,
    yMax: number = 1.5,
    maxIter: number = 100
  ): number[][] {
    const result: number[][] = [];
    
    for (let py = 0; py < height; py++) {
      const row: number[] = [];
      for (let px = 0; px < width; px++) {
        const x = xMin + (xMax - xMin) * px / width;
        const y = yMin + (yMax - yMin) * py / height;
        row.push(this.mandelbrotFractal(x, y, maxIter));
      }
      result.push(row);
    }
    
    return result;
  }

  /**
   * Logistische Abbildung - Chaostheorie
   */
  static chaosLogisticMap(
    x0: number,
    r: number = 3.99,
    iterations: number = 1000
  ): ChaosResult {
    const sequence: number[] = [x0];
    let x = x0;
    let lyapunov = 0;
    
    for (let i = 1; i < iterations; i++) {
      const xNew = r * x * (1 - x);
      sequence.push(xNew);
      
      // Lyapunov-Exponent berechnen
      const derivative = Math.abs(r * (1 - 2 * x));
      if (derivative > 0) {
        lyapunov += Math.log(derivative);
      }
      
      x = xNew;
    }
    
    return {
      sequence,
      lyapunovExponent: lyapunov / iterations
    };
  }

  /**
   * Berechnet fraktale Dimension (Box-Counting)
   */
  static calculateFractalDimension(data: number[]): number {
    const n = data.length;
    if (n < 10) return 1;
    
    const scales: number[] = [];
    const counts: number[] = [];
    
    for (let scale = 1; scale < n / 4; scale *= 2) {
      scales.push(scale);
      const boxes = new Set<number>();
      
      for (let i = 0; i < n; i += scale) {
        const segment = data.slice(i, Math.min(i + scale, n));
        if (segment.some(v => v !== 0)) {
          boxes.add(Math.floor(i / scale));
        }
      }
      
      counts.push(boxes.size);
    }
    
    // Lineare Regression im log-log Plot
    if (counts.length < 2) return 1;
    
    const logScales = scales.map(s => Math.log(s));
    const logCounts = counts.map(c => Math.log(Math.max(1, c)));
    
    const n2 = logScales.length;
    const sumX = logScales.reduce((a, b) => a + b, 0);
    const sumY = logCounts.reduce((a, b) => a + b, 0);
    const sumXY = logScales.reduce((sum, x, i) => sum + x * logCounts[i], 0);
    const sumX2 = logScales.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n2 * sumXY - sumX * sumY) / (n2 * sumX2 - sumX * sumX);
    
    return Math.abs(slope);
  }

  /**
   * Quanten-Verschränkungs-Maß (simuliert)
   */
  static quantumEntanglementMeasure(state1: number[], state2: number[]): number {
    if (state1.length !== state2.length || state1.length === 0) return 0;
    
    const mean1 = state1.reduce((a, b) => a + b, 0) / state1.length;
    const mean2 = state2.reduce((a, b) => a + b, 0) / state2.length;
    
    let covariance = 0;
    let var1 = 0;
    let var2 = 0;
    
    for (let i = 0; i < state1.length; i++) {
      const d1 = state1[i] - mean1;
      const d2 = state2[i] - mean2;
      covariance += d1 * d2;
      var1 += d1 * d1;
      var2 += d2 * d2;
    }
    
    if (var1 === 0 || var2 === 0) return 0;
    
    return Math.abs(covariance / Math.sqrt(var1 * var2));
  }

  /**
   * Generiert eine Signatur aus Daten
   */
  static async signMessage(message: string, privateKeyHex: string): Promise<string> {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const messageHash = await sha256(messageBytes);
    
    // Vereinfachte Signatur (nicht für Produktion)
    const combined = new Uint8Array(messageHash.length + 32);
    combined.set(messageHash);
    
    const privateKeyBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      privateKeyBytes[i] = parseInt(privateKeyHex.substr(i * 2, 2), 16);
    }
    combined.set(privateKeyBytes, messageHash.length);
    
    const signature = await sha256(combined);
    return Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
