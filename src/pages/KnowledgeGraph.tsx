import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Network, Trash2 } from 'lucide-react';
import { GraphVisualization } from '@/features/knowledge-graph/components/GraphVisualization';

interface KnowledgeNode {
  id: string;
  label: string;
  node_type: string;
  properties: any;
  created_at: string;
}

interface KnowledgeEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: string;
  weight: number;
  properties: any;
}

const nodeTypes = ['concept', 'entity', 'event', 'document', 'person', 'organization', 'location'];
const edgeTypes = ['related_to', 'part_of', 'causes', 'derived_from', 'similar_to', 'contradicts'];

export default function KnowledgeGraph() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false);

  const [newNode, setNewNode] = useState({
    label: '',
    node_type: 'concept',
    description: ''
  });

  const [newEdge, setNewEdge] = useState({
    source_node_id: '',
    target_node_id: '',
    edge_type: 'related_to',
    weight: 1.0
  });

  const fetchGraph = useCallback(async () => {
    if (!user) return;
    
    try {
      const [nodesRes, edgesRes] = await Promise.all([
        supabase.from('knowledge_nodes').select('*').eq('user_id', user.id),
        supabase.from('knowledge_edges').select('*').eq('user_id', user.id)
      ]);

      if (nodesRes.error) throw nodesRes.error;
      if (edgesRes.error) throw edgesRes.error;

      setNodes(nodesRes.data || []);
      setEdges(edgesRes.data || []);
    } catch (error: any) {
      toast.error('Failed to load knowledge graph');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const handleAddNode = async () => {
    if (!user || !newNode.label.trim()) {
      toast.error('Please provide a node label');
      return;
    }

    try {
      const { error } = await supabase.from('knowledge_nodes').insert({
        user_id: user.id,
        label: newNode.label,
        node_type: newNode.node_type,
        properties: { description: newNode.description }
      });

      if (error) throw error;

      toast.success('Node created successfully');
      setNewNode({ label: '', node_type: 'concept', description: '' });
      setIsAddNodeOpen(false);
      fetchGraph();
    } catch (error: any) {
      toast.error('Failed to create node');
      console.error(error);
    }
  };

  const handleAddEdge = async () => {
    if (!user || !newEdge.source_node_id || !newEdge.target_node_id) {
      toast.error('Please select both source and target nodes');
      return;
    }

    if (newEdge.source_node_id === newEdge.target_node_id) {
      toast.error('Source and target nodes must be different');
      return;
    }

    try {
      const { error } = await supabase.from('knowledge_edges').insert({
        user_id: user.id,
        source_node_id: newEdge.source_node_id,
        target_node_id: newEdge.target_node_id,
        edge_type: newEdge.edge_type,
        weight: newEdge.weight,
        properties: {}
      });

      if (error) throw error;

      toast.success('Connection created successfully');
      setNewEdge({ source_node_id: '', target_node_id: '', edge_type: 'related_to', weight: 1.0 });
      setIsAddEdgeOpen(false);
      fetchGraph();
    } catch (error: any) {
      toast.error('Failed to create connection');
      console.error(error);
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      // Delete edges first
      await supabase.from('knowledge_edges')
        .delete()
        .or(`source_node_id.eq.${nodeId},target_node_id.eq.${nodeId}`);

      // Then delete node
      const { error } = await supabase.from('knowledge_nodes').delete().eq('id', nodeId);
      if (error) throw error;

      toast.success('Node deleted');
      fetchGraph();
    } catch (error: any) {
      toast.error('Failed to delete node');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access your knowledge graph.</p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <Network className="w-8 h-8" />
                Knowledge Graph
              </h1>
              <p className="text-muted-foreground">
                Visualize and manage semantic relationships between your data
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Knowledge Node</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={newNode.label}
                        onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                        placeholder="Enter node label"
                      />
                    </div>
                    <div>
                      <Label htmlFor="node_type">Type</Label>
                      <Select value={newNode.node_type} onValueChange={(value) => setNewNode({ ...newNode, node_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newNode.description}
                        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <Button onClick={handleAddNode} className="w-full">Create Node</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddEdgeOpen} onOpenChange={setIsAddEdgeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Connection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Connection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="source">Source Node</Label>
                      <Select value={newEdge.source_node_id} onValueChange={(value) => setNewEdge({ ...newEdge, source_node_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source node" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edge_type">Relationship Type</Label>
                      <Select value={newEdge.edge_type} onValueChange={(value) => setNewEdge({ ...newEdge, edge_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {edgeTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="target">Target Node</Label>
                      <Select value={newEdge.target_node_id} onValueChange={(value) => setNewEdge({ ...newEdge, target_node_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target node" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddEdge} className="w-full">Create Connection</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading knowledge graph...</p>
          </Card>
        ) : nodes.length === 0 ? (
          <Card className="p-8 text-center">
            <Network className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Knowledge Nodes Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first node to start building your knowledge graph
            </p>
            <Button onClick={() => setIsAddNodeOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Node
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Graph Visualization</h3>
              <GraphVisualization nodes={nodes} edges={edges} />
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Nodes ({nodes.length})</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {nodes.map((node) => (
                  <Card key={node.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{node.label}</h4>
                        <p className="text-sm text-muted-foreground">{node.node_type}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNode(node.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {node.properties?.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {node.properties.description}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Connections ({edges.length})</h3>
              <div className="space-y-2">
                {edges.map((edge) => {
                  const sourceNode = nodes.find(n => n.id === edge.source_node_id);
                  const targetNode = nodes.find(n => n.id === edge.target_node_id);
                  return (
                    <div key={edge.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sourceNode?.label}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-sm text-muted-foreground">{edge.edge_type}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{targetNode?.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
