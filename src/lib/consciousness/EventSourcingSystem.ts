/**
 * Event Sourcing System (OmniVerse DIL)
 * Immutable event log for complete state reconstruction
 */

export enum EventType {
  THOUGHT_CREATED = 'thought.created',
  NEURON_FIRED = 'neuron.fired',
  BOT_ACTIVATED = 'bot.activated',
  CELL_MUTATED = 'cell.mutated',
  QUANTUM_MEASURED = 'quantum.measured',
  PEER_CONNECTED = 'peer.connected',
  SYSTEM_STATE_CHANGED = 'system.state.changed'
}

export interface DomainEvent {
  id: string;
  type: EventType;
  aggregateId: string;
  payload: any;
  metadata: {
    timestamp: number;
    userId?: string;
    source: string;
  };
  sequence: number;
}

export interface Snapshot {
  id: string;
  aggregateId: string;
  state: any;
  version: number;
  timestamp: number;
}

export class EventSourcingSystem {
  private events: DomainEvent[] = [];
  private snapshots: Map<string, Snapshot> = new Map();
  private eventHandlers: Map<EventType, ((event: DomainEvent) => void)[]> = new Map();
  private sequenceCounter: number = 0;
  private maxEventsBeforeSnapshot: number = 100;

  append(type: EventType, aggregateId: string, payload: any, source: string = 'system'): DomainEvent {
    const event: DomainEvent = {
      id: this.generateEventId(),
      type,
      aggregateId,
      payload,
      metadata: {
        timestamp: Date.now(),
        source
      },
      sequence: this.sequenceCounter++
    };

    this.events.push(event);
    
    // Trigger handlers
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach(handler => handler(event));
    
    // Check if snapshot is needed
    const eventsForAggregate = this.events.filter(e => e.aggregateId === aggregateId);
    if (eventsForAggregate.length >= this.maxEventsBeforeSnapshot) {
      this.createSnapshot(aggregateId, eventsForAggregate);
    }
    
    return event;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  on(type: EventType, handler: (event: DomainEvent) => void) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)!.push(handler);
  }

  off(type: EventType, handler: (event: DomainEvent) => void) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  getEventsForAggregate(aggregateId: string, fromSequence: number = 0): DomainEvent[] {
    return this.events
      .filter(e => e.aggregateId === aggregateId && e.sequence >= fromSequence)
      .sort((a, b) => a.sequence - b.sequence);
  }

  getEventsByType(type: EventType, limit: number = 100): DomainEvent[] {
    return this.events
      .filter(e => e.type === type)
      .slice(-limit);
  }

  getAllEvents(limit: number = 1000): DomainEvent[] {
    return this.events.slice(-limit);
  }

  replay(aggregateId: string, reducer: (state: any, event: DomainEvent) => any, initialState: any = {}): any {
    // Check for snapshot
    const snapshot = this.snapshots.get(aggregateId);
    let state = snapshot ? snapshot.state : initialState;
    const fromSequence = snapshot ? snapshot.version : 0;
    
    // Replay events from snapshot
    const events = this.getEventsForAggregate(aggregateId, fromSequence);
    events.forEach(event => {
      state = reducer(state, event);
    });
    
    return state;
  }

  private createSnapshot(aggregateId: string, events: DomainEvent[]) {
    // This is a simplified snapshot - in real system would use actual state
    const snapshot: Snapshot = {
      id: this.generateEventId(),
      aggregateId,
      state: {
        eventCount: events.length,
        lastEvent: events[events.length - 1]
      },
      version: events[events.length - 1].sequence,
      timestamp: Date.now()
    };
    
    this.snapshots.set(aggregateId, snapshot);
  }

  getSnapshot(aggregateId: string): Snapshot | undefined {
    return this.snapshots.get(aggregateId);
  }

  getStats() {
    const eventsByType = new Map<EventType, number>();
    this.events.forEach(e => {
      eventsByType.set(e.type, (eventsByType.get(e.type) || 0) + 1);
    });
    
    return {
      totalEvents: this.events.length,
      totalSnapshots: this.snapshots.size,
      eventsByType: Object.fromEntries(eventsByType),
      currentSequence: this.sequenceCounter,
      memoryUsage: (JSON.stringify(this.events).length / 1024).toFixed(2) + ' KB'
    };
  }

  clear() {
    this.events = [];
    this.snapshots.clear();
    this.sequenceCounter = 0;
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  importEvents(json: string) {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        this.events = imported;
        this.sequenceCounter = Math.max(...imported.map(e => e.sequence)) + 1;
      }
    } catch (e) {
      console.error('Failed to import events:', e);
    }
  }
}
