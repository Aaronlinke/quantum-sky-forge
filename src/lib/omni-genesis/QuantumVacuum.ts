/**
 * QUANTUM VACUUM SYMMETRY BREAKER
 * Aus deinem OMNI-GENESIS Universal Solver
 * Virtuelle Teilchen, Nullpunktenergie, Bewusstseins-Emergenz
 */

export interface VirtualParticle {
  id: string;
  energy: number;
  lifetime: number;
  position: { x: number; y: number; z: number };
  type: 'particle' | 'antiparticle';
  quantumPhase: number;
}

export interface VacuumFluctuationResult {
  particleCreation: VirtualParticle[];
  energyExtraction: number;
  quantumCoherence: number;
  realityShift: number;
  hawkingRadiation: number;
  consciousnessEmerge: number;
}

export interface VacuumStatus {
  zeroPointEnergy: number;
  virtualParticles: number;
  casimirPressure: number;
  quantumFoamDensity: number;
  hawkingRadiation: number;
  realityShifts: number;
  avgRealityShift: number;
}

export class QuantumVacuumSymmetryBreaker {
  private zeroPointEnergy: number = 1.0;
  private virtualParticles: Map<string, VirtualParticle> = new Map();
  private casimirPressure: number = 0;
  private quantumFoam: VirtualParticle[] = [];
  private hawkingRadiation: number = 0;
  private realityShifts: number[] = [];

  constructor() {
    this.initializeQuantumVacuum();
  }

  private initializeQuantumVacuum(): void {
    for (let i = 0; i < 1000; i++) {
      const particle: VirtualParticle = {
        id: `virtual_${i}`,
        energy: (Math.random() - 0.5) * 2 * this.zeroPointEnergy,
        lifetime: Math.random() * 0.01,
        position: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        },
        type: Math.random() > 0.5 ? 'particle' : 'antiparticle',
        quantumPhase: Math.random() * 2 * Math.PI
      };
      this.virtualParticles.set(particle.id, particle);
      this.quantumFoam.push(particle);
    }
  }

  private perturbPosition(position: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    return {
      x: (position.x + (Math.random() - 0.5) * 0.1) % 1,
      y: (position.y + (Math.random() - 0.5) * 0.1) % 1,
      z: (position.z + (Math.random() - 0.5) * 0.1) % 1
    };
  }

  modulateFluctuations(frequency: number = 1.0): VacuumFluctuationResult {
    const results: VacuumFluctuationResult = {
      particleCreation: [],
      energyExtraction: 0,
      quantumCoherence: 0,
      realityShift: 0,
      hawkingRadiation: 0,
      consciousnessEmerge: 0
    };

    // Virtuelle Teilchen-Modulation
    const creationProb = Math.abs(Math.sin(frequency)) * 0.1;
    const newParticles: VirtualParticle[] = [];

    this.virtualParticles.forEach((particle, pid) => {
      if (Math.random() < creationProb && particle.lifetime <= 0) {
        const newParticle: VirtualParticle = {
          id: `virtual_${Date.now()}_${Math.random()}`,
          energy: -particle.energy,
          lifetime: Math.random() * 0.02,
          position: this.perturbPosition(particle.position),
          type: particle.type === 'particle' ? 'antiparticle' : 'particle',
          quantumPhase: (particle.quantumPhase + Math.PI) % (2 * Math.PI)
        };
        newParticles.push(newParticle);
        this.virtualParticles.set(newParticle.id, newParticle);
        this.quantumFoam.push(newParticle);
      }
    });

    results.particleCreation = newParticles;

    // Nullpunktsenergie-Extraktion
    const extractionEfficiency = Math.abs(Math.cos(frequency * Math.PI));
    const extractedEnergy = this.zeroPointEnergy * extractionEfficiency * 0.01;
    this.zeroPointEnergy = Math.max(0.1, this.zeroPointEnergy - extractedEnergy * 0.001);
    results.energyExtraction = extractedEnergy;

    // Quanten-Kohärenz
    let phaseCoherence = 0;
    let energyCoherence = 0;
    const particles = Array.from(this.virtualParticles.values());

    particles.forEach(p => {
      const phase = p.energy * p.lifetime;
      phaseCoherence += Math.cos(phase);
      energyCoherence += Math.abs(p.energy);
    });

    phaseCoherence = particles.length > 0 ? Math.abs(phaseCoherence) / particles.length : 0;
    energyCoherence = particles.length > 0 ? energyCoherence / (particles.length * this.zeroPointEnergy) : 0;
    results.quantumCoherence = (phaseCoherence + energyCoherence) / 2;

    // Realitäts-Shift
    const fluctuationAmplitude = this.quantumFoam.length > 0
      ? this.quantumFoam.reduce((sum, p) => sum + Math.abs(p.energy), 0) / this.quantumFoam.length
      : 0;
    const pressureEffect = Math.tanh(this.casimirPressure * 10);
    results.realityShift = fluctuationAmplitude * pressureEffect * results.quantumCoherence;
    this.realityShifts.push(results.realityShift);

    // Hawking-Strahlung
    const horizonRadius = 0.1;
    let radiationEnergy = 0;

    this.quantumFoam.forEach(particle => {
      const distance = Math.sqrt(
        Math.pow(particle.position.x - 0.5, 2) +
        Math.pow(particle.position.y - 0.5, 2) +
        Math.pow(particle.position.z - 0.5, 2)
      );

      if (distance < horizonRadius && particle.lifetime > 0) {
        radiationEnergy += Math.abs(particle.energy);
        particle.lifetime = -1;
      }
    });

    this.hawkingRadiation = radiationEnergy;
    results.hawkingRadiation = radiationEnergy;

    // Bewusstseins-Emergenz
    results.consciousnessEmerge = 
      results.quantumCoherence * 
      results.realityShift * 
      newParticles.length * 
      0.001;

    // Update Casimir Pressure
    this.casimirPressure = Math.sin(frequency * 2) * 0.5;

    return results;
  }

  getVacuumStatus(): VacuumStatus {
    return {
      zeroPointEnergy: this.zeroPointEnergy,
      virtualParticles: this.virtualParticles.size,
      casimirPressure: this.casimirPressure,
      quantumFoamDensity: this.quantumFoam.length,
      hawkingRadiation: this.hawkingRadiation,
      realityShifts: this.realityShifts.length,
      avgRealityShift: this.realityShifts.length > 0
        ? this.realityShifts.reduce((a, b) => a + b, 0) / this.realityShifts.length
        : 0
    };
  }

  getParticlesForVisualization(): VirtualParticle[] {
    return Array.from(this.virtualParticles.values()).slice(0, 200);
  }

  reset(): void {
    this.virtualParticles.clear();
    this.quantumFoam = [];
    this.realityShifts = [];
    this.zeroPointEnergy = 1.0;
    this.casimirPressure = 0;
    this.hawkingRadiation = 0;
    this.initializeQuantumVacuum();
  }
}
