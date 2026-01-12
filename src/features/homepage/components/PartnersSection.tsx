import { Building2, GraduationCap, Globe, Handshake } from "lucide-react";

const PartnersSection = () => {
  const partnerCategories = [
    {
      icon: Building2,
      title: "Industrie-Partner",
      partners: [
        { name: "Quantum Computing AG", type: "Technologie" },
        { name: "SecureNet GmbH", type: "Cybersecurity" },
        { name: "DataFlow Systems", type: "Infrastruktur" },
        { name: "Neural Dynamics", type: "KI-Forschung" },
      ],
    },
    {
      icon: GraduationCap,
      title: "Akademische Partner",
      partners: [
        { name: "ETH Zürich", type: "Quantencomputing" },
        { name: "TU München", type: "Informatik" },
        { name: "Max-Planck-Institut", type: "Physik" },
        { name: "Fraunhofer AISEC", type: "Security" },
      ],
    },
    {
      icon: Globe,
      title: "Globale Initiativen",
      partners: [
        { name: "W3C", type: "Web-Standards" },
        { name: "IEEE", type: "Technische Standards" },
        { name: "DIF", type: "Dezentrale Identität" },
        { name: "OpenAI Alliance", type: "KI-Governance" },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Partnerschaften</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Starke Partner für eine starke Vision
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Gemeinsam mit führenden Institutionen und Unternehmen gestalten wir die Zukunft des Internets
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {partnerCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-border/20 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.partners.map((partner, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-background/30 rounded-xl border border-border/10 hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium">{partner.name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-secondary/20 rounded-full text-secondary">
                        {partner.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { value: "50+", label: "Partner weltweit" },
            { value: "12", label: "Länder vertreten" },
            { value: "8", label: "Forschungsinstitute" },
            { value: "€25M", label: "Gemeinsame Investitionen" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 glass rounded-xl border border-border/20">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Become Partner CTA */}
        <div className="glass rounded-3xl p-8 md:p-12 border-2 border-primary/30 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Werden Sie Partner</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Sind Sie eine Organisation, die an der Zukunft des Internets mitarbeiten möchte? 
            Wir freuen uns auf Ihre Kontaktaufnahme.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Partner werden
            </button>
            <button className="px-8 py-4 glass rounded-xl font-semibold border border-border/20 hover:border-primary/30 transition-colors">
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
