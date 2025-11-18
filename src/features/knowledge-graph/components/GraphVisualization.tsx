import { useEffect, useRef } from 'react';

interface Node {
  id: string;
  label: string;
  node_type: string;
}

interface Edge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: string;
}

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
}

export function GraphVisualization({ nodes, edges }: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (nodes.length === 0) {
      ctx.fillStyle = 'hsl(var(--muted-foreground))';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No nodes to visualize', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Create node positions in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    const nodePositions = new Map<string, { x: number; y: number }>();
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions.set(node.id, { x, y });
    });

    // Draw edges
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    edges.forEach((edge) => {
      const source = nodePositions.get(edge.source_node_id);
      const target = nodePositions.get(edge.target_node_id);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      // Draw edge label
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      ctx.fillStyle = 'hsl(var(--muted-foreground))';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(edge.edge_type, midX, midY);
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.fill();
      ctx.strokeStyle = 'hsl(var(--primary-foreground))';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = 'hsl(var(--primary-foreground))';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text if too long
      const maxWidth = 50;
      const words = node.label.split(' ');
      let line = '';
      const lines: string[] = [];
      
      words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      lines.push(line);

      const lineHeight = 12;
      const startY = pos.y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((text, i) => {
        ctx.fillText(text.trim(), pos.x, startY + i * lineHeight);
      });
    });
  }, [nodes, edges]);

  return (
    <div ref={containerRef} className="w-full rounded-lg border bg-card">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  );
}
