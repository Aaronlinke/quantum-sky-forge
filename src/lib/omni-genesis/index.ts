/**
 * OMNI-GENESIS - Universal Solver Module
 * Vollständige mathematische Implementierung der Lex Universalis
 * 
 * Enthält:
 * - OmniGenesisCore: Fundamentales H-N-G System mit Vorwärts/Rückwärts-Iteration
 * - MathematicalTimeMachine: Rückwärtsrechner mit Signatur-Dekodierung
 * - QuantumVacuum: Virtuelle Teilchen und Nullpunktenergie
 * - CryptoLab: ECDSA, Bitcoin-Adressen, Fraktale Kryptographie
 * - MetaMatrix: 12 mathematische Archetypen
 * - FractalCosmology: 45°-Rotation Mandelbrot-Kosmos
 * - CosmologicalEngine: Ψ_{n+1} = R(45°) · Ψ_n² + C_vac
 */

// Core System - Das fundamentale OMNIGENESIS System
export {
  OmniGenesisCore,
  type OmniGenesisState,
  type SystemCoefficients,
  type PerturbationParams,
  type EvolutionResult,
  type ComplexNumber,
  type JacobiMatrix,
  DEFAULT_COEFFICIENTS,
  CALIBRATED_COEFFICIENTS,
  DEFAULT_PERTURBATIONS,
  INITIAL_STATE,
  omniGenesisCore,
  calibratedCore,
  CosmologicalEngine,
  type CosmologicalMatrix,
  cosmologicalEngine,
  ResonanceAnalyzer,
  type ResonanceResult,
  resonanceAnalyzer
} from './OmniGenesisCore';

// Time Machine - Mathematischer Rückwärtsrechner
export {
  MathematicalTimeMachine,
  type TimeMachineState,
  type SignatureCoefficients,
  type TimeEvolution,
  type RoundTripResult,
  type DetailedCalculation
} from './MathematicalTimeMachine';

// Quantum Vacuum - Virtuelle Teilchen & Nullpunktenergie
export {
  QuantumVacuumSymmetryBreaker,
  type VirtualParticle,
  type VacuumFluctuationResult,
  type VacuumStatus
} from './QuantumVacuum';

// Crypto Lab - ECDSA, Bitcoin, Fraktale Kryptographie
export * from './CryptoLab';

// Meta Matrix - 12 Mathematische Archetypen
export * from './MetaMatrix';

// Fractal Cosmology - 45°-Rotation Mandelbrot-Kosmos
export * from './FractalCosmology';
