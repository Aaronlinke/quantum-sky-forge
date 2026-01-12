import { Users, Brain, Code, Palette, Shield, Globe } from "lucide-react";

const TeamSection = () => {
  const teams = [
    {
      icon: Brain,
      name: "KI-Orchestrator Hierarchie",
      role: "Strategische Führung",
      members: [
        { name: "Direktor KI", role: "Meta-Vision & Strategie" },
        { name: "PM KI-A", role: "Interface-Koordination" },
        { name: "PM KI-B", role: "Self-Learning Systeme" },
      ],
      color: "primary",
    },
    {
      icon: Code,
      name: "Core Protocol Team",
      role: "Protokoll-Entwicklung",
      members: [
        { name: "Quantum Layer", role: "Kryptographie & Verschränkung" },
        { name: "Consensus Engine", role: "DAG-basierter Konsens" },
        { name: "Meta-Protocol", role: "Schicht-übergreifende Integration" },
      ],
      color: "secondary",
    },
    {
      icon: Palette,
      name: "Spezialisten-Ebene",
      role: "Domänen-Expertise",
      members: [
        { name: "Grafik-Spezialist", role: "AURA-Synthesizer" },
        { name: "Weltenbau-Spezialist", role: "SAEMS Architektur" },
        { name: "Storytelling-Spezialist", role: "Narrative Evolution" },
      ],
      color: "accent",
    },
    {
      icon: Shield,
      name: "Security & Privacy",
      role: "Sicherheitsarchitektur",
      members: [
        { name: "ZKP-Team", role: "Zero-Knowledge Proofs" },
        { name: "Quantum-Safe Team", role: "Post-Quanten-Kryptographie" },
        { name: "Audit-Team", role: "Kontinuierliche Überwachung" },
      ],
      color: "success",
    },
  ];

  const advisors = [
    { name: "Prof. Dr. Quantus", field: "Quanteninformatik", institution: "ETH Zürich" },
    { name: "Dr. Neuralis", field: "Neuronale Netze", institution: "MIT" },
    { name: "Prof. Cryptus", field: "Kryptographie", institution: "Stanford" },
    { name: "Dr. Ethica", field: "KI-Ethik", institution: "Oxford" },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-secondary">Das Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Mensch-KI-Kollaboration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ein einzigartiges Zusammenspiel aus menschlicher Kreativität und KI-gestützter Präzision
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {teams.map((team, index) => {
            const Icon = team.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-border/20 hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 bg-${team.color}/20 rounded-xl`}>
                    <Icon className={`w-8 h-8 text-${team.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {team.members.map((member, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 p-4 bg-background/30 rounded-xl border border-border/10"
                    >
                      <div className={`w-10 h-10 rounded-full bg-${team.color}/20 flex items-center justify-center`}>
                        <span className={`text-${team.color} font-bold`}>
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisory Board */}
        <div className="glass rounded-3xl p-8 md:p-12 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Wissenschaftlicher Beirat</h3>
            <p className="text-muted-foreground">
              Führende Experten aus Wissenschaft und Forschung begleiten unsere Vision
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => (
              <div 
                key={index}
                className="text-center p-6 glass rounded-xl border border-border/20 hover:border-secondary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold mb-1">{advisor.name}</h4>
                <p className="text-sm text-secondary mb-1">{advisor.field}</p>
                <p className="text-xs text-muted-foreground">{advisor.institution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Interessiert, Teil des Teams zu werden?
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Offene Positionen ansehen
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
