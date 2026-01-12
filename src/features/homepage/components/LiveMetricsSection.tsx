import { useState, useEffect } from "react";
import { Activity, Cpu, HardDrive, Network, Users, Zap, Globe, Shield } from "lucide-react";

const LiveMetricsSection = () => {
  const [metrics, setMetrics] = useState({
    activeNodes: 12847,
    transactions: 2456789,
    dataProcessed: 847.3,
    latency: 12,
    uptime: 99.97,
    users: 25430,
    agents: 8921,
    securityScore: 98.5,
  });

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 10 - 3),
        transactions: prev.transactions + Math.floor(Math.random() * 100),
        dataProcessed: +(prev.dataProcessed + Math.random() * 0.1).toFixed(1),
        latency: Math.max(8, Math.min(20, prev.latency + Math.random() * 2 - 1)),
        uptime: Math.min(100, prev.uptime + Math.random() * 0.001),
        users: prev.users + Math.floor(Math.random() * 5),
        agents: prev.agents + Math.floor(Math.random() * 3),
        securityScore: Math.min(100, Math.max(95, prev.securityScore + Math.random() * 0.1 - 0.05)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      icon: Network,
      label: "Aktive Nodes",
      value: metrics.activeNodes.toLocaleString(),
      change: "+12%",
      color: "primary",
    },
    {
      icon: Zap,
      label: "Transaktionen",
      value: metrics.transactions.toLocaleString(),
      change: "+847/s",
      color: "secondary",
    },
    {
      icon: HardDrive,
      label: "Daten verarbeitet",
      value: `${metrics.dataProcessed} PB`,
      change: "+2.4%",
      color: "accent",
    },
    {
      icon: Activity,
      label: "Avg. Latenz",
      value: `${metrics.latency.toFixed(1)} ms`,
      change: "-15%",
      color: "success",
    },
    {
      icon: Cpu,
      label: "Uptime",
      value: `${metrics.uptime.toFixed(2)}%`,
      change: "SLA: 99.9%",
      color: "primary",
    },
    {
      icon: Users,
      label: "Aktive Nutzer",
      value: metrics.users.toLocaleString(),
      change: "+342 heute",
      color: "secondary",
    },
    {
      icon: Globe,
      label: "KI-Agenten",
      value: metrics.agents.toLocaleString(),
      change: "+89 diese Woche",
      color: "accent",
    },
    {
      icon: Shield,
      label: "Security Score",
      value: `${metrics.securityScore.toFixed(1)}%`,
      change: "A+ Rating",
      color: "success",
    },
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-secondary/30" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm font-semibold text-success">Live System Status</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Echtzeit-Netzwerk-Metriken
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparente Einblicke in die Performance und Gesundheit des Web 4.0 Netzwerks
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-border/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${metric.color}/20 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${metric.color}`} />
                  </div>
                  <span className="text-xs px-2 py-1 bg-success/10 rounded-full text-success font-semibold">
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1 font-mono">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="mt-12 glass rounded-2xl p-6 border border-success/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
              </span>
              <span className="text-lg font-semibold">Alle Systeme operationell</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-success/20 rounded-full text-success text-sm font-medium">
                Core: ✓
              </span>
              <span className="px-3 py-1 bg-success/20 rounded-full text-success text-sm font-medium">
                API: ✓
              </span>
              <span className="px-3 py-1 bg-success/20 rounded-full text-success text-sm font-medium">
                Storage: ✓
              </span>
              <span className="px-3 py-1 bg-success/20 rounded-full text-success text-sm font-medium">
                Agents: ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMetricsSection;
