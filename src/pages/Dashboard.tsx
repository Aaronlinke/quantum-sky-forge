import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Database, Bot, Share2, Atom, Brain, Shield, ArrowRight
} from 'lucide-react';

interface DashboardStats {
  dataPods: number;
  agents: number;
  knowledgeNodes: number;
  knowledgeEdges: number;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ dataPods: 0, agents: 0, knowledgeNodes: 0, knowledgeEdges: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const pods = await (supabase.from('data_pods').select('id', { count: 'exact', head: true }) as any).eq('owner_id', user.id);
      const agents = await (supabase.from('user_agents').select('id', { count: 'exact', head: true }) as any).eq('user_id', user.id);
      const nodes = await (supabase.from('knowledge_nodes').select('id', { count: 'exact', head: true }) as any).eq('user_id', user.id);
      const edges = await (supabase.from('knowledge_edges').select('id', { count: 'exact', head: true }) as any).eq('user_id', user.id);
      setStats({
        dataPods: pods.count || 0,
        agents: agents.count || 0,
        knowledgeNodes: nodes.count || 0,
        knowledgeEdges: edges.count || 0,
      });
    };
    fetchStats();
  }, [user]);

  const widgets = [
    {
      icon: Database,
      title: 'Data Pods',
      value: stats.dataPods,
      label: 'Verschlüsselte Pods',
      link: '/data-pods',
      color: 'text-primary',
    },
    {
      icon: Bot,
      title: 'Agenten',
      value: stats.agents,
      label: 'Installierte Agenten',
      link: '/agent-marketplace',
      color: 'text-secondary',
    },
    {
      icon: Share2,
      title: 'Wissensgraph',
      value: `${stats.knowledgeNodes} / ${stats.knowledgeEdges}`,
      label: 'Knoten / Kanten',
      link: '/knowledge-graph',
      color: 'text-accent',
    },
    {
      icon: Atom,
      title: 'OMNI-GENESIS',
      value: '5 Module',
      label: 'Quantum · Time · Crypto · Matrix · Fractal',
      link: '/omni-genesis',
      color: 'text-primary',
    },
    {
      icon: Brain,
      title: 'Neural Core',
      value: 'Bereit',
      label: 'Black Sultan OS',
      link: '/black-sultan-os',
      color: 'text-secondary',
    },
    {
      icon: Shield,
      title: 'Einwilligungen',
      value: 'Aktiv',
      label: 'Consent-Management',
      link: '/consent',
      color: 'text-green-400',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Willkommen */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Willkommen zurück, <span className="text-gradient">{profile?.display_name || user?.email?.split('@')[0] || 'Nutzer'}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Dein Web 4.0 Dashboard – alle Systeme auf einen Blick</p>
        {profile?.did && (
          <div className="mt-2 text-xs font-mono text-muted-foreground">
            DID: <span className="text-primary">{profile.did}</span>
          </div>
        )}
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map(w => (
          <Link key={w.title} to={w.link}>
            <Card className="p-5 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <w.icon className={`w-5 h-5 ${w.color}`} />
                    <h3 className="font-bold text-foreground">{w.title}</h3>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{w.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{w.label}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Schnellzugriff</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/omni-genesis">
            <Button variant="outline" className="gap-2">
              <Atom className="w-4 h-4" /> OMNI-GENESIS Hub öffnen
            </Button>
          </Link>
          <Link to="/data-pods">
            <Button variant="outline" className="gap-2">
              <Database className="w-4 h-4" /> Neuen Data Pod erstellen
            </Button>
          </Link>
          <Link to="/agent-marketplace">
            <Button variant="outline" className="gap-2">
              <Bot className="w-4 h-4" /> Agenten entdecken
            </Button>
          </Link>
          <Link to="/knowledge-graph">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Wissensgraph erkunden
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
