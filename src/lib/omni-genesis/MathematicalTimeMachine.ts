/**
 * MATHEMATISCHE ZEITMASCHINE - RÜCKWÄRTSRECHNER v2.0
 * System Linke - Rekonstruktion aus Signaturen
 * Differentialgleichungen H(t), N(t), G(t)
 */

export interface TimeMachineState {
  H: number;
  N: number;
  G: number;
  t: number;
}

export interface SignatureCoefficients {
  matrix: number[][];
  signature: string;
}

export interface TimeEvolution {
  states: TimeMachineState[];
  eigenvalues: { real: number; imag: number }[];
}

export class MathematicalTimeMachine {
  private coefficientMatrix: number[][] = [
    [0, 0.7, 1.4],
    [0.9, 0.3, 0.5],
    [1.5, 1.0, 1.0]
  ];
  private signature: string = "07e935fa";
  private history: TimeMachineState[] = [];

  constructor() {}

  /**
   * Dekodiert eine Hex-Signatur in Koeffizienten
   */
  decodeSignature(sig: string): SignatureCoefficients {
    const hexDigits = sig.replace(/[^0-9a-fA-F]/g, '').split('');
    const values: number[] = [];
    
    for (const digit of hexDigits) {
      values.push(parseInt(digit, 16) / 10);
    }

    // Fülle auf 9 Werte auf wenn nötig
    while (values.length < 9) {
      values.push(1.0);
    }

    // Erstelle 3x3 Matrix
    const matrix: number[][] = [
      [0, values[1] || 0.7, values[2] || 1.4],
      [values[3] || 0.9, values[4] || 0.3, values[5] || 0.5],
      [values[6] || 1.5, values[7] || 1.0, values[8] || 1.0]
    ];

    this.coefficientMatrix = matrix;
    this.signature = sig;

    return { matrix, signature: sig };
  }

  /**
   * Berechnet die Zeitentwicklung mit Runge-Kutta 4. Ordnung
   */
  evolve(initialState: TimeMachineState, tEnd: number, dt: number = 0.01): TimeEvolution {
    const states: TimeMachineState[] = [{ ...initialState }];
    let state = { ...initialState };

    const derivatives = (s: TimeMachineState): { dH: number; dN: number; dG: number } => {
      const m = this.coefficientMatrix;
      return {
        dH: m[0][0] * s.H + m[0][1] * s.N + m[0][2] * s.G,
        dN: m[1][0] * s.H + m[1][1] * s.N + m[1][2] * s.G,
        dG: m[2][0] * s.H + m[2][1] * s.N + m[2][2] * s.G
      };
    };

    // Runge-Kutta 4. Ordnung
    while (state.t < tEnd) {
      const k1 = derivatives(state);
      
      const s2 = {
        H: state.H + k1.dH * dt / 2,
        N: state.N + k1.dN * dt / 2,
        G: state.G + k1.dG * dt / 2,
        t: state.t + dt / 2
      };
      const k2 = derivatives(s2);

      const s3 = {
        H: state.H + k2.dH * dt / 2,
        N: state.N + k2.dN * dt / 2,
        G: state.G + k2.dG * dt / 2,
        t: state.t + dt / 2
      };
      const k3 = derivatives(s3);

      const s4 = {
        H: state.H + k3.dH * dt,
        N: state.N + k3.dN * dt,
        G: state.G + k3.dG * dt,
        t: state.t + dt
      };
      const k4 = derivatives(s4);

      state = {
        H: state.H + (k1.dH + 2*k2.dH + 2*k3.dH + k4.dH) * dt / 6,
        N: state.N + (k1.dN + 2*k2.dN + 2*k3.dN + k4.dN) * dt / 6,
        G: state.G + (k1.dG + 2*k2.dG + 2*k3.dG + k4.dG) * dt / 6,
        t: state.t + dt
      };

      states.push({ ...state });
    }

    this.history = states;

    // Berechne Eigenwerte (vereinfacht)
    const eigenvalues = this.calculateEigenvalues();

    return { states, eigenvalues };
  }

  /**
   * Rückwärts-Rekonstruktion: Von Endzustand zum Ursprung
   */
  reconstructOrigin(finalState: TimeMachineState, tBack: number): TimeMachineState[] {
    const states: TimeMachineState[] = [{ ...finalState }];
    let state = { ...finalState };
    const dt = -0.01; // Negative Zeit für Rückwärts

    const derivatives = (s: TimeMachineState): { dH: number; dN: number; dG: number } => {
      const m = this.coefficientMatrix;
      return {
        dH: m[0][0] * s.H + m[0][1] * s.N + m[0][2] * s.G,
        dN: m[1][0] * s.H + m[1][1] * s.N + m[1][2] * s.G,
        dG: m[2][0] * s.H + m[2][1] * s.N + m[2][2] * s.G
      };
    };

    while (state.t > -tBack) {
      const k1 = derivatives(state);
      state = {
        H: state.H + k1.dH * dt,
        N: state.N + k1.dN * dt,
        G: state.G + k1.dG * dt,
        t: state.t + dt
      };
      states.push({ ...state });
    }

    return states.reverse();
  }

  /**
   * Berechnet Eigenwerte der Koeffizientenmatrix (charakteristisches Polynom)
   */
  private calculateEigenvalues(): { real: number; imag: number }[] {
    const m = this.coefficientMatrix;
    
    // Trace und Determinante für 3x3
    const trace = m[0][0] + m[1][1] + m[2][2];
    
    // Vereinfachte Eigenwertberechnung
    const a = m[0][0], b = m[0][1], c = m[0][2];
    const d = m[1][0], e = m[1][1], f = m[1][2];
    const g = m[2][0], h = m[2][1], i = m[2][2];

    // Charakteristisches Polynom Koeffizienten
    const p = -(a + e + i);
    const q = a*e + a*i + e*i - b*d - c*g - f*h;
    const r = -(a*e*i + b*f*g + c*d*h - c*e*g - b*d*i - a*f*h);

    // Cardano-Formel für kubische Gleichung
    const Q = (3*q - p*p) / 9;
    const R = (9*p*q - 27*r - 2*p*p*p) / 54;
    const D = Q*Q*Q + R*R;

    const eigenvalues: { real: number; imag: number }[] = [];

    if (D >= 0) {
      const S = Math.cbrt(R + Math.sqrt(D));
      const T = Math.cbrt(R - Math.sqrt(D));
      eigenvalues.push({ real: S + T - p/3, imag: 0 });
      eigenvalues.push({ real: -(S + T)/2 - p/3, imag: Math.sqrt(3) * (S - T) / 2 });
      eigenvalues.push({ real: -(S + T)/2 - p/3, imag: -Math.sqrt(3) * (S - T) / 2 });
    } else {
      const theta = Math.acos(R / Math.sqrt(-Q*Q*Q));
      const sqrtQ = 2 * Math.sqrt(-Q);
      eigenvalues.push({ real: sqrtQ * Math.cos(theta/3) - p/3, imag: 0 });
      eigenvalues.push({ real: sqrtQ * Math.cos((theta + 2*Math.PI)/3) - p/3, imag: 0 });
      eigenvalues.push({ real: sqrtQ * Math.cos((theta + 4*Math.PI)/3) - p/3, imag: 0 });
    }

    return eigenvalues;
  }

  getCoefficients(): SignatureCoefficients {
    return { matrix: this.coefficientMatrix, signature: this.signature };
  }

  getHistory(): TimeMachineState[] {
    return this.history;
  }

  /**
   * Generiert eine neue Signatur aus aktuellen Zuständen
   */
  generateSignature(state: TimeMachineState): string {
    const values = [
      Math.abs(state.H),
      Math.abs(state.N),
      Math.abs(state.G)
    ];
    
    let sig = '';
    for (const v of values) {
      const hex = Math.floor((v * 10) % 16).toString(16);
      sig += hex;
    }
    
    // Füge Zeit-Hash hinzu
    const timeHash = Math.floor(state.t * 1000) % 65536;
    sig += timeHash.toString(16).padStart(4, '0');
    
    return sig;
  }
}
