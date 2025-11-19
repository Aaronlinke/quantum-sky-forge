/**
 * NanoCell System - Portiert von Python
 * 10009 Nanozellen mit MicroPrograms
 */

export interface NanoCell {
  cellId: number;
  value: number;
  lastUpdate: number;
}

export interface MicroProgram {
  programId: number;
  name: string;
  operation: (value: number) => number;
}

export class NanoCellSystem {
  private cells: Map<number, NanoCell>;
  private microPrograms: Map<number, MicroProgram>;
  private readonly numCells: number;

  constructor(numCells: number = 10009) {
    this.numCells = numCells;
    this.cells = new Map();
    this.microPrograms = new Map();
    
    // Initialize cells with random values
    for (let i = 1; i <= numCells; i++) {
      this.cells.set(i, {
        cellId: i,
        value: Math.floor(Math.random() * 100),
        lastUpdate: Date.now()
      });
    }
    
    this.initializeDefaultMicroPrograms();
  }

  private initializeDefaultMicroPrograms() {
    this.addMicroProgram(1, 'increment', (x) => x + 1);
    this.addMicroProgram(2, 'double', (x) => x * 2);
    this.addMicroProgram(3, 'half', (x) => x > 0 ? Math.floor(x / 2) : 0);
    this.addMicroProgram(4, 'modulo_100', (x) => x % 100);
    this.addMicroProgram(5, 'random', () => Math.floor(Math.random() * 1000));
    this.addMicroProgram(6, 'square', (x) => x * x);
    this.addMicroProgram(7, 'negate', (x) => -x);
    this.addMicroProgram(8, 'absolute', (x) => Math.abs(x));
  }

  addMicroProgram(id: number, name: string, operation: (value: number) => number) {
    this.microPrograms.set(id, { programId: id, name, operation });
  }

  getCell(cellId: number): NanoCell | undefined {
    return this.cells.get(cellId);
  }

  updateCell(cellId: number, newValue: number): boolean {
    const cell = this.cells.get(cellId);
    if (cell) {
      cell.value = newValue;
      cell.lastUpdate = Date.now();
      return true;
    }
    return false;
  }

  executeMicroProgram(programId: number, cellId: number): boolean {
    const program = this.microPrograms.get(programId);
    const cell = this.cells.get(cellId);
    
    if (program && cell) {
      try {
        const newValue = program.operation(cell.value);
        this.updateCell(cellId, newValue);
        return true;
      } catch (e) {
        console.error(`Error executing program ${programId} on cell ${cellId}:`, e);
      }
    }
    return false;
  }

  distributeEncoding(encoding: string): Map<number, string> {
    const distribution = new Map<number, string>();
    const bytes = new TextEncoder().encode(encoding);
    
    bytes.forEach((byte, index) => {
      const cellId = (index % this.numCells) + 1;
      const cell = this.cells.get(cellId);
      if (cell) {
        this.updateCell(cellId, byte);
        distribution.set(cellId, byte.toString(16).padStart(2, '0'));
      }
    });
    
    return distribution;
  }

  reconstructEncoding(distribution: Map<number, string>): string {
    const bytes: number[] = [];
    distribution.forEach((hex) => {
      bytes.push(parseInt(hex, 16));
    });
    return new TextDecoder().decode(new Uint8Array(bytes));
  }

  getCellsInRange(start: number, end: number): NanoCell[] {
    const cells: NanoCell[] = [];
    for (let i = start; i <= end && i <= this.numCells; i++) {
      const cell = this.cells.get(i);
      if (cell) cells.push(cell);
    }
    return cells;
  }

  getStats() {
    const values = Array.from(this.cells.values()).map(c => c.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      totalCells: this.numCells,
      avgValue: avg.toFixed(2),
      minValue: min,
      maxValue: max,
      totalPrograms: this.microPrograms.size
    };
  }

  randomMutation(intensity: number = 0.1) {
    this.cells.forEach((cell, id) => {
      if (Math.random() < intensity) {
        const programId = Math.floor(Math.random() * this.microPrograms.size) + 1;
        this.executeMicroProgram(programId, id);
      }
    });
  }
}
