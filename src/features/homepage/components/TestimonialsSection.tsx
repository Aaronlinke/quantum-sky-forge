import { Quote, Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Web 4.0 ist nicht nur eine technologische Evolution – es ist eine fundamentale Neuerfindung dessen, was das Internet sein kann. Die Vision der vollständigen Datensouveränität ist revolutionär.",
      author: "Prof. Dr. Elena Müller",
      role: "Direktorin für Digitale Transformation",
      organization: "TU Berlin",
      rating: 5,
    },
    {
      quote: "Als Entwickler bin ich begeistert von der Intent-Based Architecture. Endlich können wir Anwendungen bauen, die wirklich verstehen, was Nutzer wollen – nicht nur, was sie klicken.",
      author: "Marcus Chen",
      role: "Lead Developer",
      organization: "Quantum Labs",
      rating: 5,
    },
    {
      quote: "Die Integration von autonomen KI-Agenten mit Zero-Knowledge-Proofs eröffnet völlig neue Möglichkeiten für Privacy-First Services. Das ist die Zukunft.",
      author: "Dr. Sarah Kim",
      role: "Chief Privacy Officer",
      organization: "SecureNet AG",
      rating: 5,
    },
    {
      quote: "Endlich ein Internet-Paradigma, das Nachhaltigkeit nicht als Afterthought behandelt. Die energieeffiziente Architektur ist beeindruckend.",
      author: "Thomas Weber",
      role: "Sustainability Director",
      organization: "GreenTech Foundation",
      rating: 5,
    },
    {
      quote: "Die mathematische Rigorsität der Lex Universalis ist bemerkenswert. Jeder Algorithmus ist beweisbar korrekt und vollständig reversibel.",
      author: "Prof. Dr. Alexander Stein",
      role: "Mathematiker",
      organization: "Max-Planck-Institut",
      rating: 5,
    },
    {
      quote: "Für unsere Forschung ist die Transparenz und Dezentralisierung des Netzwerks entscheidend. Web 4.0 liefert genau das.",
      author: "Dr. Lisa Hoffmann",
      role: "Research Lead",
      organization: "Fraunhofer AISEC",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/40 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Quote className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Stimmen aus der Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Was Experten sagen
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Führende Köpfe aus Wissenschaft, Wirtschaft und Technologie über Web 4.0
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 border border-border/20 hover:border-accent/30 transition-all duration-300 animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-border/20 pt-4">
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-secondary">{testimonial.role}</p>
                <p className="text-xs text-muted-foreground">{testimonial.organization}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 glass rounded-2xl p-8 border border-primary/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-sm text-muted-foreground">Durchschnittliche Bewertung</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">2.5K+</div>
              <p className="text-sm text-muted-foreground">Entwickler-Reviews</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Würden weiterempfehlen</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Auszeichnungen erhalten</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
