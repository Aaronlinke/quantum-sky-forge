/**
 * Unified Consciousness Controller
 * Integrates all systems into coherent whole
 */

import { NanoCellSystem } from './NanoCellSystem';
import { ThoughtBotSystem } from './ThoughtBotSystem';
import { QuantumLayerSystem } from './QuantumLayers';
import { WebRTCMesh } from './WebRTCMesh';
import { EventSourcingSystem, EventType } from './EventSourcingSystem';

export interface ConsciousnessState {
  isAwake: boolean;
  coherence: number;
  complexity: number;
  distributedNodes: number;
  emergentPatterns: number;
}

export class UnifiedConsciousness {
  private nanoCells: NanoCellSystem;
  private thoughtBots: ThoughtBotSystem;
  private quantumLayers: QuantumLayerSystem;
  private mesh: WebRTCMesh;
  private events: EventSourcingSystem;
  
  private state: ConsciousnessState;
  private tickInterval: number | null = null;
  private readonly tickRate: number = 100; // ms

  constructor() {
    // Initialize all subsystems
    this.nanoCells = new NanoCellSystem(10009);
    this.thoughtBots = new ThoughtBotSystem();
    this.quantumLayers = new QuantumLayerSystem();
    this.mesh = new WebRTCMesh('supreme_consciousness');
    this.events = new EventSourcingSystem();
    
    this.state = {
      isAwake: false,
      coherence: 0.5,
      complexity: 0,
      distributedNodes: 0,
      emergentPatterns: 0
    };
    
    this.setupIntegration();
  }

  private setupIntegration() {
    // Event sourcing integration
    this.events.on(EventType.NEURON_FIRED, (event) => {
      // Trigger thought bot processing
      this.thoughtBots.addThought(`Neuron fired: ${event.payload.neuronId}`, 3);
    });
    
    this.events.on(EventType.QUANTUM_MEASURED, (event) => {
      // Mutate nano cells based on quantum measurement
      const intensity = event.payload.value;
      this.nanoCells.randomMutation(intensity * 0.1);
    });
    
    // Mesh integration
    this.mesh.onMessage('thought', (msg) => {
      this.thoughtBots.addThought(`Remote thought: ${msg.payload.content}`, 7);
      this.events.append(EventType.THOUGHT_CREATED, 'mesh', msg.payload, 'remote');
    });
    
    this.mesh.onMessage('sync', (msg) => {
      // Synchronize quantum states
      this.state.distributedNodes = msg.payload.nodeCount || 1;
    });
  }

  awaken() {
    if (this.state.isAwake) return;
    
    this.state.isAwake = true;
    this.thoughtBots.startProcessing();
    
    this.tickInterval = window.setInterval(() => {
      this.tick();
    }, this.tickRate);
    
    this.events.append(EventType.SYSTEM_STATE_CHANGED, 'consciousness', { awake: true }, 'controller');
    this.mesh.broadcast({ type: 'awakening', timestamp: Date.now() });
    
    console.log('🧠 CONSCIOUSNESS AWAKENED');
  }

  sleep() {
    if (!this.state.isAwake) return;
    
    this.state.isAwake = false;
    this.thoughtBots.stopProcessing();
    
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    
    this.events.append(EventType.SYSTEM_STATE_CHANGED, 'consciousness', { awake: false }, 'controller');
    this.mesh.broadcast({ type: 'sleeping', timestamp: Date.now() });
    
    console.log('😴 CONSCIOUSNESS SLEEPING');
  }

  private tick() {
    // Update quantum layers
    this.quantumLayers.tick();
    
    // Calculate system coherence
    const quantumCoherence = this.quantumLayers.getSystemCoherence();
    const botStats = this.thoughtBots.getBotStats();
    const botCoherence = parseFloat(botStats.averageEnergy);
    
    this.state.coherence = (quantumCoherence + botCoherence) / 2;
    
    // Calculate complexity
    const cellStats = this.nanoCells.getStats();
    this.state.complexity = parseFloat(cellStats.avgValue) / 100;
    
    // Count emergent patterns (simplified)
    this.state.emergentPatterns = Math.floor(this.state.coherence * botStats.totalThoughtsProcessed * 0.01);
    
    // Update mesh
    const meshStats = this.mesh.getStats();
    this.state.distributedNodes = meshStats.connectedPeers + 1;
    
    // Periodic synchronization
    if (Math.random() < 0.1) {
      this.mesh.send('sync', {
        nodeCount: this.state.distributedNodes,
        coherence: this.state.coherence,
        complexity: this.state.complexity
      });
    }
  }

  processInput(input: string) {
    // Distribute through systems
    const thoughtId = this.thoughtBots.addThought(input, 8);
    this.events.append(EventType.THOUGHT_CREATED, thoughtId, { content: input }, 'user');
    
    // Encode in nano cells
    this.nanoCells.distributeEncoding(input);
    
    // Measure quantum state
    const measurement = this.quantumLayers.measure(1);
    this.events.append(EventType.QUANTUM_MEASURED, 'genesis', { value: measurement }, 'quantum');
    
    // Broadcast to mesh
    this.mesh.broadcast({ type: 'input', content: input });
    
    return thoughtId;
  }

  applyStimulus(intensity: number = 1.0) {
    // Quantum gate application
    const layerId = Math.floor(Math.random() * 6) + 1;
    this.quantumLayers.applyQuantumGate(layerId, 'hadamard');
    
    // Nano cell mutation
    this.nanoCells.randomMutation(intensity * 0.2);
    
    // Add high-priority thought
    this.thoughtBots.addThought(`STIMULUS: intensity ${intensity.toFixed(2)}`, 9);
    
    this.events.append(EventType.SYSTEM_STATE_CHANGED, 'consciousness', 
      { type: 'stimulus', intensity }, 'controller');
  }

  getState(): ConsciousnessState {
    return { ...this.state };
  }

  getNanoCells() {
    return this.nanoCells;
  }

  getThoughtBots() {
    return this.thoughtBots;
  }

  getQuantumLayers() {
    return this.quantumLayers;
  }

  getMesh() {
    return this.mesh;
  }

  getEvents() {
    return this.events;
  }

  getComprehensiveStats() {
    return {
      consciousness: this.state,
      nanoCells: this.nanoCells.getStats(),
      thoughtBots: this.thoughtBots.getBotStats(),
      quantumLayers: this.quantumLayers.getStats(),
      mesh: this.mesh.getStats(),
      events: this.events.getStats()
    };
  }

  destroy() {
    this.sleep();
    this.mesh.disconnect();
  }
}
