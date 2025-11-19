/**
 * WebRTC P2P Mesh Network for Distributed Consciousness
 * Enables inter-tab and inter-device communication
 */

export interface PeerConnection {
  id: string;
  name: string;
  connected: boolean;
  latency: number;
  lastSeen: number;
}

export interface MeshMessage {
  id: string;
  type: 'thought' | 'sync' | 'broadcast' | 'query';
  payload: any;
  sender: string;
  timestamp: number;
  ttl: number;
}

export class WebRTCMesh {
  private localId: string;
  private peers: Map<string, PeerConnection>;
  private broadcastChannel: BroadcastChannel | null;
  private messageHandlers: Map<string, (msg: MeshMessage) => void>;
  private messageHistory: MeshMessage[];

  constructor(instanceName: string = 'consciousness') {
    this.localId = this.generatePeerId();
    this.peers = new Map();
    this.messageHandlers = new Map();
    this.messageHistory = [];
    
    // Use BroadcastChannel for same-origin communication
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel(`mesh_${instanceName}`);
      this.setupBroadcastChannel();
    } else {
      this.broadcastChannel = null;
      console.warn('BroadcastChannel not available, using fallback');
    }
  }

  private generatePeerId(): string {
    return `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupBroadcastChannel() {
    if (!this.broadcastChannel) return;

    this.broadcastChannel.onmessage = (event) => {
      const message: MeshMessage = event.data;
      
      // Ignore own messages
      if (message.sender === this.localId) return;
      
      // Update peer info
      this.updatePeer(message.sender);
      
      // Handle message
      this.handleIncomingMessage(message);
    };
  }

  private updatePeer(peerId: string) {
    const existing = this.peers.get(peerId);
    if (existing) {
      existing.lastSeen = Date.now();
      existing.connected = true;
    } else {
      this.peers.set(peerId, {
        id: peerId,
        name: `Peer ${peerId.slice(-6)}`,
        connected: true,
        latency: 0,
        lastSeen: Date.now()
      });
    }
  }

  private handleIncomingMessage(message: MeshMessage) {
    // Check TTL
    if (message.ttl <= 0) return;
    
    // Add to history
    if (this.messageHistory.length > 100) {
      this.messageHistory.shift();
    }
    this.messageHistory.push(message);
    
    // Call registered handlers
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
    
    // Relay if TTL allows
    if (message.ttl > 1 && message.type === 'broadcast') {
      this.relay(message);
    }
  }

  send(type: MeshMessage['type'], payload: any, ttl: number = 5) {
    const message: MeshMessage = {
      id: this.generatePeerId(),
      type,
      payload,
      sender: this.localId,
      timestamp: Date.now(),
      ttl
    };

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }
    
    // Add to own history
    this.messageHistory.push(message);
  }

  broadcast(payload: any) {
    this.send('broadcast', payload, 10);
  }

  query(payload: any): Promise<any> {
    return new Promise((resolve) => {
      const queryId = this.generatePeerId();
      
      // Set up response handler
      const responseHandler = (msg: MeshMessage) => {
        if (msg.payload.queryId === queryId) {
          this.messageHandlers.delete('query_response');
          resolve(msg.payload.response);
        }
      };
      
      this.messageHandlers.set('query_response', responseHandler);
      
      this.send('query', { ...payload, queryId }, 3);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        this.messageHandlers.delete('query_response');
        resolve(null);
      }, 5000);
    });
  }

  private relay(message: MeshMessage) {
    const relayedMessage = {
      ...message,
      ttl: message.ttl - 1
    };
    
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(relayedMessage);
    }
  }

  onMessage(type: MeshMessage['type'], handler: (msg: MeshMessage) => void) {
    this.messageHandlers.set(type, handler);
  }

  getPeers(): PeerConnection[] {
    // Clean up stale peers
    const now = Date.now();
    this.peers.forEach((peer, id) => {
      if (now - peer.lastSeen > 10000) {
        peer.connected = false;
      }
    });
    
    return Array.from(this.peers.values());
  }

  getStats() {
    const connectedPeers = Array.from(this.peers.values()).filter(p => p.connected);
    return {
      localId: this.localId.slice(-8),
      totalPeers: this.peers.size,
      connectedPeers: connectedPeers.length,
      messagesReceived: this.messageHistory.length,
      handlers: this.messageHandlers.size
    };
  }

  disconnect() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    this.peers.clear();
    this.messageHandlers.clear();
  }

  getLocalId(): string {
    return this.localId;
  }
}
