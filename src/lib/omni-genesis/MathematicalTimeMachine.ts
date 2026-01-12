/**
 * MATHEMATISCHE ZEITMASCHINE - RÜCKWÄRTSRECHNER v3.0
 * OMNIGENESIS System - Vollständige mathematische Spezifikation
 * Differentialgleichungen H(t), N(t), G(t) mit exakter Inversion
 */

import { 
  OmniGenesisCore, 
  OmniGenesisState, 
  INITIAL_STATE, 
  DEFAULT_COEFFICIENTS,
  CALIBRATED_COEFFICIENTS,
  SystemCoefficients
} from './OmniGenesisCore';

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

export interface RoundTripResult {
  forward: TimeMachineState[];
  backward: TimeMachineState[];
  error: number;
  isConsistent: boolean;
  validationHash: string;
}

export interface DetailedCalculation {
  step: number;
  inputs: { H: number; N: number; G: number };
  intermediates: {
    term1: number;
    term2: number;
    term3: number;
    eps_H: number;
    eps_N: number;
    eps_G: number;
  };
  outputs: { H: number; N: number; G: number };
}

export class MathematicalTimeMachine {
  private core: OmniGenesisCore;
  private history: TimeMachineState[] = [];
  private detailedHistory: DetailedCalculation[] = [];
  private signature: string = "07e935fa";
  private useCalibrated: boolean = false;

  constructor(useCalibrated: boolean = false) {
    this.useCalibrated = useCalibrated;
    this.core = new OmniGenesisCore(
      useCalibrated ? CALIBRATED_COEFFICIENTS : DEFAULT_COEFFICIENTS
    );
  }

  /**
   * Die empirisch validierten Zustandssequenzen
   */
  static readonly EMPIRICAL_SEQUENCE: TimeMachineState[] = [
    { H: -4.256, N: 5.824, G: 1.952, t: 0 },
    { H: -3.126, N: 6.213, G: 2.224, t: 1 },
    { H: -1.942, N: 6.470, G: 2.622, t: 2 },
    { H: -0.755, N: 6.591, G: 3.136, t: 3 },
    { H: 0.383, N: 6.576, G: 3.748, t: 4 },
    { H: 1.425, N: 6.521, G: 4.447, t: 5 }
  ];

  /**
   * Dekodiert eine Hex-Signatur in Koeffizienten
   */
  decodeSignature(sig: string): SignatureCoefficients {
    const hexDigits = sig.replace(/[^0-9a-fA-F]/g, '').split('');
    const values: number[] = [];
    
    for (const digit of hexDigits) {
      values.push(parseInt(digit, 16) / 10);
    }

    while (values.length < 9) {
      values.push(1.0);
    }

    const matrix: number[][] = [
      [0, values[1] || 0.7, values[2] || 1.4],
      [values[3] || 0.9, values[4] || 0.3, values[5] || 0.5],
      [values[6] || 1.5, values[7] || 1.0, values[8] || 1.0]
    ];

    this.signature = sig;
    return { matrix, signature: sig };
  }

  /**
   * Vorwärts-Evolution mit detaillierter Berechnung
   */
  evolveDetailed(initialState: TimeMachineState, steps: number): {
    states: TimeMachineState[];
    calculations: DetailedCalculation[];
  } {
    const states: TimeMachineState[] = [{ ...initialState }];
    const calculations: DetailedCalculation[] = [];
    const coef = this.core.getCoefficients();

    let state = { ...initialState };

    for (let step = 0; step < steps; step++) {
      const eps_H = 0.001 * Math.sin(2 * Math.PI * state.t / 100);
      const eps_N = 0.0005 * Math.cos(2 * Math.PI * state.t / 73);
      const eps_G = 0.0002 * Math.sin(2 * Math.PI * state.t / 37 + Math.PI / 4);

      // H(t+1) = H(t) + α·N(t) - β·G(t) + ε_H(t)
      const term1_H = coef.alpha * state.N;
      const term2_H = coef.beta * state.G;
      const H_next = state.H + term1_H - term2_H + eps_H;

      // N(t+1) = γ·N(t) + δ·|H(t)|·sgn(H(t)) + ε_N(t)
      const signH = state.H >= 0 ? 1 : -1;
      const term1_N = coef.gamma * state.N;
      const term2_N = coef.delta * Math.abs(state.H) * signH;
      const N_next = term1_N + term2_N + eps_N;

      // G(t+1) = G(t) + η·[H(t+1) + N(t+1)]·[1 + 0.01·tanh(G(t)/10)] + ε_G(t)
      const sumHN = H_next + N_next;
      const tanhFactor = 1 + 0.01 * Math.tanh(state.G / 10);
      const term1_G = coef.eta * sumHN * tanhFactor;
      const G_next = state.G + term1_G + eps_G;

      calculations.push({
        step,
        inputs: { H: state.H, N: state.N, G: state.G },
        intermediates: {
          term1: term1_H,
          term2: term2_H,
          term3: term1_G,
          eps_H,
          eps_N,
          eps_G
        },
        outputs: { H: H_next, N: N_next, G: G_next }
      });

      state = { H: H_next, N: N_next, G: G_next, t: state.t + 1 };
      states.push({ ...state });
    }

    this.history = states;
    this.detailedHistory = calculations;

    return { states, calculations };
  }

  /**
   * Standard Vorwärts-Evolution
   */
  evolve(initialState: TimeMachineState, tEnd: number, dt: number = 1): TimeEvolution {
    const result = this.core.evolveForward(initialState as OmniGenesisState, tEnd);
    
    const states = result.states.map(s => ({
      H: s.H,
      N: s.N,
      G: s.G,
      t: s.t
    }));

    this.history = states;

    return {
      states,
      eigenvalues: result.eigenvalues
    };
  }

  /**
   * Rückwärts-Rekonstruktion mit Newton-Raphson
   */
  reconstructOrigin(finalState: TimeMachineState, steps: number): TimeMachineState[] {
    const result = this.core.evolveBackward(finalState as OmniGenesisState, steps);
    
    return result.states.map(s => ({
      H: s.H,
      N: s.N,
      G: s.G,
      t: s.t
    }));
  }

  /**
   * Vollständige Rundreise: T=0 → T=5 → T=0
   * Validiert die mathematische Konsistenz
   */
  performRoundTrip(initialState: TimeMachineState = INITIAL_STATE, steps: number = 5): RoundTripResult {
    const result = this.core.roundTrip(initialState as OmniGenesisState, steps);

    const forward = result.forward.map(s => ({ H: s.H, N: s.N, G: s.G, t: s.t }));
    const backward = result.backward.map(s => ({ H: s.H, N: s.N, G: s.G, t: s.t }));

    // Generiere Validierungs-Hash
    const finalState = forward[forward.length - 1];
    const validationHash = this.generateSignature(finalState);

    return {
      forward,
      backward,
      error: result.error,
      isConsistent: result.isConsistent,
      validationHash
    };
  }

  /**
   * Berechnet Eigenwerte der Koeffizientenmatrix
   */
  calculateEigenvalues(): { real: number; imag: number }[] {
    if (this.history.length === 0) {
      return [{ real: 0, imag: 0 }];
    }
    const state = this.history[0] as OmniGenesisState;
    return this.core.calculateEigenvalues(state);
  }

  /**
   * Generiert Signatur aus Zustand
   */
  generateSignature(state: TimeMachineState): string {
    return this.core.generateSignature(state as OmniGenesisState);
  }

  /**
   * Formatiert einen Zustand mit hoher Präzision
   */
  formatState(state: TimeMachineState, decimals: number = 6): string {
    return `t=${state.t}: H=${state.H.toFixed(decimals)}, N=${state.N.toFixed(decimals)}, G=${state.G.toFixed(decimals)}`;
  }

  /**
   * Gibt die vollständige Zustandssequenz formatiert aus
   */
  getFormattedSequence(decimals: number = 6): string[] {
    return this.history.map(s => this.formatState(s, decimals));
  }

  getCoefficients(): SignatureCoefficients {
    const coef = this.core.getCoefficients();
    const matrix = [
      [1, coef.alpha, -coef.beta],
      [coef.delta, coef.gamma, 0],
      [coef.eta, coef.eta, 1]
    ];
    return { matrix, signature: this.signature };
  }

  getHistory(): TimeMachineState[] {
    return [...this.history];
  }

  getDetailedHistory(): DetailedCalculation[] {
    return [...this.detailedHistory];
  }

  /**
   * Vergleicht berechnete mit empirischen Werten
   */
  validateAgainstEmpirical(): {
    deviations: { t: number; dH: number; dN: number; dG: number }[];
    totalError: number;
    isValid: boolean;
  } {
    const empirical = MathematicalTimeMachine.EMPIRICAL_SEQUENCE;
    const computed = this.history;

    if (computed.length === 0) {
      this.evolve(empirical[0], 5);
    }

    const deviations: { t: number; dH: number; dN: number; dG: number }[] = [];
    let totalError = 0;

    for (let i = 0; i < Math.min(empirical.length, this.history.length); i++) {
      const emp = empirical[i];
      const comp = this.history[i];
      
      const dH = Math.abs(comp.H - emp.H);
      const dN = Math.abs(comp.N - emp.N);
      const dG = Math.abs(comp.G - emp.G);
      
      deviations.push({ t: i, dH, dN, dG });
      totalError += dH + dN + dG;
    }

    return {
      deviations,
      totalError,
      isValid: totalError < 0.1
    };
  }
}
