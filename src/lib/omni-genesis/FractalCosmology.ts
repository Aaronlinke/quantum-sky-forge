/**
 * FRAKTALE KOSMOLOGIE DER 45°-ROTATION
 * Der Mandelbrot Effect des Universums
 * Aus deiner Fraktal-Kosmologie Theorie
 */

export interface CosmicState {
  real: number;
  imag: number;
  iteration: number;
  coherence: number;
}

export interface RotationResult {
  states: CosmicState[];
  finalState: CosmicState;
  diverged: boolean;
  escapeIteration: number;
}

export interface UniversalCoherenceFactor {
  microstructure: number;    // Lokale Kohärenzfelder
  macroResonance: number;    // Makroskopische Resonanz (Strings, Filamente)
  largeScaleAnisotropy: number; // Großskalige Anisotropien (CMB, Gravitation)
}

export interface CosmicLayer {
  name: string;
  scale: string;
  description: string;
  ucf: number;
}

// Die kosmischen Ebenen des Mandelbrot-Kosmos
export const COSMIC_LAYERS: CosmicLayer[] = [
  {
    name: 'Planck-Skala',
    scale: '10⁻³⁵ m',
    description: 'Primäre 45°-Vakuumrotation - UCF-Initialphase',
    ucf: 1.0
  },
  {
    name: 'Teilchenphysik',
    scale: '10⁻¹⁵ m',
    description: 'Iterative Symmetriebrüche - Fraktalzoom auf Mikroebene',
    ucf: 0.85
  },
  {
    name: 'Atomare Struktur',
    scale: '10⁻¹⁰ m',
    description: 'Elektronenorbitale als stehende Wellen der Rotation',
    ucf: 0.75
  },
  {
    name: 'Molekulare Ebene',
    scale: '10⁻⁹ m',
    description: 'Chemische Bindungen als Kohärenz-Knotenpunkte',
    ucf: 0.70
  },
  {
    name: 'Zelluläre Struktur',
    scale: '10⁻⁵ m',
    description: 'Leben als selbstorganisierende Fraktalstruktur',
    ucf: 0.65
  },
  {
    name: 'Planetare Skala',
    scale: '10⁶ m',
    description: 'Geologische Muster als makroskopische Iteration',
    ucf: 0.55
  },
  {
    name: 'Stellare Systeme',
    scale: '10¹¹ m',
    description: 'Sonnensysteme als orbitale Mandelbrot-Strukturen',
    ucf: 0.45
  },
  {
    name: 'Galaktische Struktur',
    scale: '10²¹ m',
    description: 'Galaxien als Unter-Mandelbrotstrukturen des kosmischen Sets',
    ucf: 0.35
  },
  {
    name: 'Kosmische Filamente',
    scale: '10²⁴ m',
    description: 'Das kosmische Netz als sichtbare Fraktal-Topologie',
    ucf: 0.25
  },
  {
    name: 'Beobachtbares Universum',
    scale: '10²⁶ m',
    description: 'CMB als glatter Randbereich der fraktalen Zone',
    ucf: 0.15
  }
];

export class FractalCosmology {
  private readonly ROTATION_ANGLE = Math.PI / 4; // 45° in Radiant
  private readonly COS_45 = Math.cos(this.ROTATION_ANGLE);
  private readonly SIN_45 = Math.sin(this.ROTATION_ANGLE);

  // Vakuum-Konstante C_vac
  private vacuumConstant: { real: number; imag: number } = { real: 0, imag: 0 };

  constructor(vacuumReal: number = 0, vacuumImag: number = 0) {
    this.vacuumConstant = { real: vacuumReal, imag: vacuumImag };
  }

  /**
   * Der kosmologische Operator: Ψ_{n+1} = R(45°) · Ψ_n² + C_vac
   * Rotiert und quadriert den Zustand
   */
  cosmologicalOperator(state: CosmicState): CosmicState {
    // 1. Quadriere den komplexen Zustand: Ψ²
    const squared = {
      real: state.real * state.real - state.imag * state.imag,
      imag: 2 * state.real * state.imag
    };

    // 2. Rotiere um 45°: R(45°) · Ψ²
    const rotated = {
      real: this.COS_45 * squared.real - this.SIN_45 * squared.imag,
      imag: this.SIN_45 * squared.real + this.COS_45 * squared.imag
    };

    // 3. Addiere Vakuum-Konstante: + C_vac
    const newState: CosmicState = {
      real: rotated.real + this.vacuumConstant.real,
      imag: rotated.imag + this.vacuumConstant.imag,
      iteration: state.iteration + 1,
      coherence: this.calculateCoherence(rotated)
    };

    return newState;
  }

  /**
   * Berechnet die Kohärenz des Zustands (UCF - Universal Coherence Factor)
   */
  private calculateCoherence(state: { real: number; imag: number }): number {
    const magnitude = Math.sqrt(state.real * state.real + state.imag * state.imag);
    // Kohärenz nimmt ab wenn Magnitude zu groß oder zu klein
    const optimalMagnitude = 1.0;
    const deviation = Math.abs(magnitude - optimalMagnitude);
    return Math.exp(-deviation * 0.5);
  }

  /**
   * Iteriert den kosmologischen Operator
   */
  iterate(
    initialReal: number,
    initialImag: number,
    maxIterations: number = 100,
    escapeRadius: number = 4
  ): RotationResult {
    const states: CosmicState[] = [];
    let state: CosmicState = {
      real: initialReal,
      imag: initialImag,
      iteration: 0,
      coherence: 1.0
    };
    states.push({ ...state });

    let diverged = false;
    let escapeIteration = maxIterations;

    for (let i = 0; i < maxIterations; i++) {
      state = this.cosmologicalOperator(state);
      states.push({ ...state });

      const magnitude = state.real * state.real + state.imag * state.imag;
      if (magnitude > escapeRadius * escapeRadius) {
        diverged = true;
        escapeIteration = i + 1;
        break;
      }
    }

    return {
      states,
      finalState: state,
      diverged,
      escapeIteration
    };
  }

  /**
   * Generiert ein 45°-rotiertes Mandelbrot-Set
   */
  generateRotatedMandelbrot(
    width: number,
    height: number,
    xMin: number = -2.5,
    xMax: number = 1.5,
    yMin: number = -2,
    yMax: number = 2,
    maxIter: number = 50
  ): { iterations: number[][]; coherence: number[][] } {
    const iterations: number[][] = [];
    const coherence: number[][] = [];

    for (let py = 0; py < height; py++) {
      const iterRow: number[] = [];
      const cohRow: number[] = [];

      for (let px = 0; px < width; px++) {
        const x = xMin + (xMax - xMin) * px / width;
        const y = yMin + (yMax - yMin) * py / height;

        // Setze Vakuum-Konstante für jeden Punkt
        this.vacuumConstant = { real: x, imag: y };

        const result = this.iterate(0, 0, maxIter);
        iterRow.push(result.escapeIteration);
        cohRow.push(result.finalState.coherence);
      }

      iterations.push(iterRow);
      coherence.push(cohRow);
    }

    return { iterations, coherence };
  }

  /**
   * Berechnet die Universal Coherence Factors für einen Zustand
   */
  calculateUCF(state: CosmicState): UniversalCoherenceFactor {
    const magnitude = Math.sqrt(state.real * state.real + state.imag * state.imag);
    const phase = Math.atan2(state.imag, state.real);

    return {
      microstructure: Math.exp(-magnitude * 0.1) * Math.cos(phase * 4) ** 2,
      macroResonance: Math.sin(state.iteration * 0.1) ** 2 * state.coherence,
      largeScaleAnisotropy: (1 - state.coherence) * Math.abs(Math.cos(phase * 2))
    };
  }

  /**
   * Simuliert den "Anti-Mandelbrot-Modus" - thermisches Gleichgewicht
   */
  antiMandelbrotMode(
    state: CosmicState,
    entropyFactor: number = 0.1
  ): CosmicState {
    // Dämpfung zur Annäherung an thermisches Gleichgewicht
    const dampedReal = state.real * (1 - entropyFactor) + (Math.random() - 0.5) * entropyFactor;
    const dampedImag = state.imag * (1 - entropyFactor) + (Math.random() - 0.5) * entropyFactor;

    return {
      real: dampedReal,
      imag: dampedImag,
      iteration: state.iteration + 1,
      coherence: state.coherence * (1 - entropyFactor * 0.5)
    };
  }

  /**
   * Zeit-Umkehr: Rückwärts-Zoom zur primordialen Rotation
   */
  reverseTimeEvolution(states: CosmicState[]): CosmicState[] {
    return [...states].reverse().map((state, index) => ({
      ...state,
      iteration: index,
      coherence: Math.min(1, state.coherence * 1.1) // Kohärenz steigt bei Rückwärts
    }));
  }

  /**
   * Generiert Visualisierungsdaten für ein Spiralmuster
   */
  generateSpiralPattern(
    numPoints: number = 1000,
    rotationsPerIteration: number = 1
  ): { x: number; y: number; coherence: number }[] {
    const points: { x: number; y: number; coherence: number }[] = [];
    
    let state: CosmicState = {
      real: 0.1,
      imag: 0.1,
      iteration: 0,
      coherence: 1.0
    };

    for (let i = 0; i < numPoints; i++) {
      const angle = i * 0.1 * rotationsPerIteration;
      const radius = 0.01 * i;
      
      // Start-Punkt auf Spirale
      state.real = radius * Math.cos(angle);
      state.imag = radius * Math.sin(angle);
      
      // Wende kosmologischen Operator an
      state = this.cosmologicalOperator(state);
      
      points.push({
        x: state.real,
        y: state.imag,
        coherence: state.coherence
      });
    }

    return points;
  }

  setVacuumConstant(real: number, imag: number): void {
    this.vacuumConstant = { real, imag };
  }

  getVacuumConstant(): { real: number; imag: number } {
    return { ...this.vacuumConstant };
  }
}
