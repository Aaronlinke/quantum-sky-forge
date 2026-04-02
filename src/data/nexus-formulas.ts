export interface FormulaVariable {
  key: string;
  description: string;
}

export interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables: Record<string, string>;
  tags: string[];
}

export interface FormulaCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  formulas: Formula[];
}

export interface NexusDataset {
  metadata: {
    title: string;
    version: string;
    totalFormulas: number;
  };
  categories: FormulaCategory[];
}

export const nexusDataset: NexusDataset = {
  metadata: {
    title: "Nexus Mathematics Dataset",
    version: "1.0.0",
    totalFormulas: 39
  },
  categories: [
    {
      id: "chaos",
      name: "Chaostheorie",
      icon: "Flame",
      description: "Erforschung komplexer dynamischer Systeme, die empfindlich auf Anfangsbedingungen reagieren.",
      formulas: [
        {
          id: "logistic-map",
          name: "Logistische Abbildung",
          latex: "x_{n+1} = r \\cdot x_n (1 - x_n)",
          description: "Polynomielle Abbildung — komplexes chaotisches Verhalten aus einfachen nichtlinearen Gleichungen.",
          variables: { "x_n": "Populationsverhältnis im Schritt n", "r": "Wachstumsrate (0 < r ≤ 4)" },
          tags: ["chaos", "logistic", "bifurcation"]
        },
        {
          id: "lyapunov-exponent",
          name: "Lyapunov-Exponent",
          latex: "\\lambda = \\lim_{N \\to \\infty} \\frac{1}{N} \\sum_{i=0}^{N-1} \\ln |f'(x_i)|",
          description: "Quantifiziert die Rate der Separation infinitesimal naher Trajektorien.",
          variables: { "\\lambda": "Lyapunov-Exponent", "f'(x_i)": "Ableitung am Punkt x_i", "N": "Iterationen" },
          tags: ["chaos", "lyapunov", "sensitivity"]
        },
        {
          id: "lorenz-system",
          name: "Lorenz-Attraktor",
          latex: "\\frac{dx}{dt} = \\sigma(y-x),\\; \\frac{dy}{dt} = x(\\rho-z)-y,\\; \\frac{dz}{dt} = xy - \\beta z",
          description: "System von ODEs mit chaotischen Lösungen — modelliert atmosphärische Konvektion.",
          variables: { "\\sigma": "Prandtl-Zahl", "\\rho": "Rayleigh-Zahl", "\\beta": "Geometrischer Faktor" },
          tags: ["chaos", "lorenz", "attractor", "ode"]
        },
        {
          id: "feigenbaum-constant",
          name: "Feigenbaum-Konstante",
          latex: "\\delta = \\lim_{n \\to \\infty} \\frac{a_{n-1} - a_{n-2}}{a_n - a_{n-1}} = 4.669201\\ldots",
          description: "Universelle Konstante für Periodenverdopplungskaskaden.",
          variables: { "\\delta": "Feigenbaum-Konstante", "a_n": "Parameterwert bei n-ter Bifurkation" },
          tags: ["chaos", "feigenbaum", "universal"]
        }
      ]
    },
    {
      id: "omnigenesis",
      name: "Omnigenese",
      icon: "Dna",
      description: "Konzepte zur genetischen Vererbung komplexer Merkmale und Krankheiten.",
      formulas: [
        {
          id: "omnigenic-liability",
          name: "Omnigenic Liability Modell",
          latex: "y = \\sum_{i \\in \\text{core}} \\beta_i g_i + \\sum_{j \\in \\text{periph}} \\beta_j g_j + \\epsilon",
          description: "Alle in krankheitsrelevanten Zellen exprimierten Gene tragen zur Heritabilität bei.",
          variables: { "y": "Phänotypische Anfälligkeit", "\\beta_i": "Kerngen-Effekt", "g_i": "Genotyp am Locus i", "\\epsilon": "Umweltrauschen" },
          tags: ["omnigenesis", "liability", "genetics"]
        },
        {
          id: "heritability-partition",
          name: "Heritabilitäts-Partitionierung",
          latex: "h^2 = \\frac{\\sigma^2_G}{\\sigma^2_P} = \\frac{\\sigma^2_{\\text{core}} + \\sigma^2_{\\text{periph}}}{\\sigma^2_G + \\sigma^2_E}",
          description: "Zerlegung der Heritabilität in Kern- und Peripherie-Komponenten.",
          variables: { "h^2": "Heritabilität", "\\sigma^2_G": "Genetische Varianz", "\\sigma^2_P": "Phänotypische Varianz" },
          tags: ["omnigenesis", "heritability", "variance"]
        }
      ]
    },
    {
      id: "information-theory",
      name: "Informationstheorie",
      icon: "Binary",
      description: "Grundlagen zur Messung, Speicherung und Übertragung von Informationen.",
      formulas: [
        {
          id: "shannon-entropy",
          name: "Shannon-Entropie",
          latex: "H(X) = -\\sum p(x) \\cdot \\log_2(p(x))",
          description: "Informationsgehalt einer Quelle in Bits.",
          variables: { "H": "Entropie in Bits", "p(x)": "Wahrscheinlichkeit von x" },
          tags: ["information", "shannon", "entropy"]
        },
        {
          id: "mutual-info",
          name: "Mutual Information (KES)",
          latex: "I(K_n ; A_0, \\ldots, A_{n-1}) \\approx 0",
          description: "KES-Kernaussage: Vergangenheit akkumuliert keine Information über Zukunft.",
          variables: { "I": "Mutual Information", "K_n": "Schlüssel zum Zeitpunkt n" },
          tags: ["information", "mutual", "kes"]
        },
        {
          id: "conditional-entropy",
          name: "Bedingte Entropie (KES)",
          latex: "H(K_n | K_{n-1}) \\approx H(K_n)",
          description: "Maximale bedingte Entropie: Vorgänger-Kenntnis reduziert keine Unsicherheit.",
          variables: { "H": "Entropie", "K_n": "Aktueller Schlüssel" },
          tags: ["information", "entropy", "kes", "conditional"]
        },
        {
          id: "kolmogorov",
          name: "Kolmogorov-Komplexität",
          latex: "K(x) = \\min\\{|p| : U(p) = x\\}",
          description: "Kürzestes Programm das x erzeugt.",
          variables: { "K": "Komplexität", "U": "Universelle Turingmaschine" },
          tags: ["information", "kolmogorov", "complexity"]
        },
        {
          id: "private-key-entropy",
          name: "Private Key Entropie",
          latex: "H(d) = \\log_2(N) \\approx 256 \\text{ bits}",
          description: "Entropie eines SECP256k1 Private Keys.",
          variables: { "N": "Kurvenordnung", "d": "Private Key" },
          tags: ["information", "entropy", "secp256k1"]
        }
      ]
    },
    {
      id: "string-theory",
      name: "Stringtheorie",
      icon: "Orbit",
      description: "Physikalische Modelle, die Elementarteilchen als eindimensionale Strings beschreiben.",
      formulas: [
        {
          id: "nambu-goto",
          name: "Nambu-Goto-Aktion",
          latex: "S = -T \\int d^2\\sigma \\sqrt{-\\det(g_{\\alpha\\beta})}",
          description: "Aktion für einen relativistischen String, proportional zur Weltfläche.",
          variables: { "S": "Aktion", "T": "Stringspannung", "g_{\\alpha\\beta}": "Induzierte Metrik" },
          tags: ["string", "nambu-goto", "action"]
        },
        {
          id: "polyakov-action",
          name: "Polyakov-Aktion",
          latex: "S_P = -\\frac{T}{2} \\int d^2\\sigma \\sqrt{-h}\\, h^{\\alpha\\beta} \\partial_\\alpha X^\\mu \\partial_\\beta X_\\mu",
          description: "Gleichwertige String-Aktion mit unabhängiger Weltflächenmetrik.",
          variables: { "h_{\\alpha\\beta}": "Weltflächenmetrik", "X^\\mu": "Raumzeit-Einbettung", "T": "Stringspannung" },
          tags: ["string", "polyakov", "action"]
        },
        {
          id: "beta-function",
          name: "Weyl-Anomalie / Beta-Funktion",
          latex: "\\beta^G_{\\mu\\nu} = R_{\\mu\\nu} + 2\\nabla_\\mu \\nabla_\\nu \\Phi - \\frac{1}{4}H_{\\mu\\lambda\\kappa}H_\\nu^{\\ \\lambda\\kappa} = 0",
          description: "Verschwindende Beta-Funktion → konforme Invarianz → Bewegungsgleichungen.",
          variables: { "R_{\\mu\\nu}": "Ricci-Tensor", "\\Phi": "Dilatonfeld", "H_{\\mu\\nu\\lambda}": "Kalb-Ramond-Feldstärke" },
          tags: ["string", "weyl", "beta", "conformal"]
        }
      ]
    },
    {
      id: "cosmology",
      name: "Kosmologie",
      icon: "Globe",
      description: "Physik des Universums — Entstehung, Expansion und Struktur.",
      formulas: [
        {
          id: "friedmann",
          name: "Friedmann-Gleichung",
          latex: "H^2 = \\frac{8\\pi G}{3}\\rho - \\frac{k}{a^2} + \\frac{\\Lambda}{3}",
          description: "Expansionsrate des Universums im Rahmen der ART.",
          variables: { "H": "Hubble-Parameter", "G": "Gravitationskonstante", "\\rho": "Energiedichte", "k": "Krümmung", "\\Lambda": "Kosmologische Konstante" },
          tags: ["cosmology", "friedmann", "expansion"]
        },
        {
          id: "einstein-field",
          name: "Einstein-Feldgleichungen",
          latex: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}",
          description: "Geometrie der Raumzeit ↔ Materie-Energie-Verteilung.",
          variables: { "G_{\\mu\\nu}": "Einstein-Tensor", "g_{\\mu\\nu}": "Metrik-Tensor", "T_{\\mu\\nu}": "Energie-Impuls-Tensor", "\\Lambda": "Kosmologische Konstante" },
          tags: ["cosmology", "einstein", "field-equations"]
        },
        {
          id: "hawking-temperature",
          name: "Hawking-Temperatur",
          latex: "T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}",
          description: "Schwarzkörperstrahlung von Schwarzen Löchern durch Quanteneffekte.",
          variables: { "T_H": "Hawking-Temperatur", "\\hbar": "Plancksches Wirkungsquantum", "M": "Masse des Schwarzen Lochs", "k_B": "Boltzmann-Konstante" },
          tags: ["cosmology", "hawking", "black-hole", "quantum"]
        }
      ]
    },
    {
      id: "lattice-cryptanalysis",
      name: "Gitter-Kryptanalyse",
      icon: "Grid3x3",
      description: "Gitter-basierte Kryptographie und Post-Quanten-Sicherheit.",
      formulas: [
        {
          id: "lll-algorithm",
          name: "LLL-Schranke",
          latex: "\\|b_1^*\\| \\leq 2^{(n-1)/4} (\\det L)^{1/n}",
          description: "Obere Schranke für den kürzesten Vektor des LLL-Algorithmus.",
          variables: { "b_1^*": "Kürzester reduzierter Basisvektor", "n": "Gitterdimension", "\\det L": "Gitterdeterminante" },
          tags: ["lattice", "lll", "reduction"]
        },
        {
          id: "svp-hardness",
          name: "SVP-Approximation",
          latex: "\\|v\\| \\leq \\gamma(n) \\cdot \\lambda_1(L)",
          description: "Approximationsfaktor für das Shortest Vector Problem.",
          variables: { "v": "Gefundener Vektor", "\\gamma(n)": "Approximationsfaktor", "\\lambda_1(L)": "Kürzeste Vektorlänge" },
          tags: ["lattice", "svp", "hardness"]
        },
        {
          id: "learning-with-errors",
          name: "Learning With Errors (LWE)",
          latex: "b = \\langle a, s \\rangle + e \\pmod{q}",
          description: "Berechnungsproblem hinter vielen Post-Quanten-Kryptosystemen.",
          variables: { "a": "Zufallsvektor", "s": "Geheimvektor", "e": "Fehlerterm", "q": "Modulus" },
          tags: ["lattice", "lwe", "post-quantum"]
        }
      ]
    },
    {
      id: "attack-algorithms",
      name: "Angriffsalgorithmen",
      icon: "Swords",
      description: "Kryptanalytische Angriffsmethoden und Quantenalgorithmen.",
      formulas: [
        {
          id: "grover-speedup",
          name: "Grovers Algorithmus",
          latex: "O(\\sqrt{N}) \\text{ vs } O(N) \\text{ klassisch}",
          description: "Quadratischer Quantenvorteil für unstrukturierte Suche.",
          variables: { "N": "Größe des Suchraums" },
          tags: ["quantum", "grover", "search"]
        },
        {
          id: "shor-period",
          name: "Shors Algorithmus",
          latex: "r : a^r \\equiv 1 \\pmod{N}, \\quad \\gcd(a^{r/2} \\pm 1, N)",
          description: "Quantenalgorithmus zur Faktorisierung in Polynomialzeit — bedroht RSA.",
          variables: { "r": "Periode der modularen Exponentiation", "a": "Zufällige Basis", "N": "Zu faktorisierende Zahl" },
          tags: ["quantum", "shor", "factoring"]
        },
        {
          id: "birthday-attack",
          name: "Birthday-Attacke",
          latex: "P(\\text{Kollision}) \\approx 1 - e^{-n^2/(2H)}, \\quad n \\approx 1.2\\sqrt{H}",
          description: "Probabilistischer Angriff über das Geburtstagsparadoxon für Hash-Kollisionen.",
          variables: { "n": "Anzahl Samples", "H": "Größe des Hash-Ausgaberaums" },
          tags: ["attack", "birthday", "collision"]
        },
        {
          id: "differential-cryptanalysis",
          name: "Differentielle Kryptanalyse",
          latex: "\\Pr[\\Delta Y = \\Delta Y^* | \\Delta X = \\Delta X^*] = p",
          description: "Untersucht die Propagation von Eingabedifferenzen durch Chiffren.",
          variables: { "\\Delta X^*": "Eingabedifferenz", "\\Delta Y^*": "Ausgabedifferenz", "p": "Differentielle Wahrscheinlichkeit" },
          tags: ["attack", "differential", "cipher"]
        }
      ]
    },
    {
      id: "bitcoin-specific",
      name: "Bitcoin-Spezifisch",
      icon: "Bitcoin",
      description: "Kryptographische Grundlagen des Bitcoin-Protokolls.",
      formulas: [
        {
          id: "hashcash-pow",
          name: "Hashcash Proof of Work",
          latex: "\\text{SHA256}(\\text{SHA256}(\\text{header})) < \\frac{2^{224}}{D}",
          description: "Bitcoins Proof-of-Work — Miner müssen einen Hash unter dem Difficulty-Target finden.",
          variables: { "\\text{header}": "Block-Header", "D": "Difficulty-Parameter" },
          tags: ["bitcoin", "pow", "mining"]
        },
        {
          id: "difficulty-adjustment",
          name: "Difficulty-Anpassung",
          latex: "D_{\\text{neu}} = D_{\\text{alt}} \\times \\frac{T_{\\text{ist}}}{T_{\\text{soll}}}",
          description: "Alle 2016 Blöcke wird die Difficulty angepasst für ~10 Min Blockzeit.",
          variables: { "D": "Difficulty", "T_{\\text{ist}}": "Zeit für letzte 2016 Blöcke", "T_{\\text{soll}}": "Erwartete Zeit (2 Wochen)" },
          tags: ["bitcoin", "difficulty", "adjustment"]
        },
        {
          id: "ecdsa-signature",
          name: "ECDSA-Signatur",
          latex: "s = k^{-1}(z + r \\cdot d_A) \\pmod{n}",
          description: "Elliptic Curve Digital Signature Algorithm für Bitcoin-Transaktionen.",
          variables: { "s": "Signaturkomponente", "k": "Zufällige Nonce", "z": "Nachrichten-Hash", "r": "x-Koordinate von kG", "d_A": "Private Key" },
          tags: ["bitcoin", "ecdsa", "signature"]
        }
      ]
    },
    {
      id: "entropy-collapse",
      name: "Entropie-Kollaps-Vektoren",
      icon: "Zap",
      description: "Entropie-Analyse und Sicherheit von Zufallszahlengeneratoren.",
      formulas: [
        {
          id: "min-entropy",
          name: "Min-Entropie",
          latex: "H_{\\infty}(X) = -\\log_2 \\max_x p(x)",
          description: "Konservativstes Entropie-Maß — basiert auf der wahrscheinlichsten Ausgabe.",
          variables: { "H_\\infty": "Min-Entropie", "p(x)": "Wahrscheinlichkeit des wahrscheinlichsten Ergebnisses" },
          tags: ["entropy", "min-entropy", "security"]
        },
        {
          id: "entropy-rate-decay",
          name: "Entropie-Zerfallsrate",
          latex: "H_n = H_0 \\cdot e^{-\\lambda t} + H_{\\text{floor}}",
          description: "Modelliert den Entropie-Abbau bei schlecht geseedeten PRNGs.",
          variables: { "H_n": "Entropie zum Zeitpunkt n", "H_0": "Anfangsentropie", "\\lambda": "Zerfallsrate", "H_{\\text{floor}}": "Minimale Entropie" },
          tags: ["entropy", "decay", "prng"]
        },
        {
          id: "leftover-hash",
          name: "Leftover Hash Lemma",
          latex: "\\text{SD}(h(X), U_m) \\leq \\frac{1}{2} \\sqrt{2^{m - H_{\\infty}(X)}}",
          description: "Garantiert nahezu gleichverteilte Ausgabe bei universellen Hash-Funktionen.",
          variables: { "\\text{SD}": "Statistische Distanz", "h": "Universelle Hash-Funktion", "m": "Ausgabelänge", "H_\\infty": "Min-Entropie der Quelle" },
          tags: ["entropy", "hash", "lemma"]
        }
      ]
    },
    {
      id: "complexity-classes",
      name: "Komplexitätsklassen",
      icon: "Layers",
      description: "Fundamentale Fragen der Berechenbarkeit und Komplexitätstheorie.",
      formulas: [
        {
          id: "p-vs-np",
          name: "P vs NP",
          latex: "\\text{P} \\subseteq \\text{NP}, \\quad \\text{P} \\stackrel{?}{=} \\text{NP}",
          description: "Das wichtigste offene Problem der theoretischen Informatik.",
          variables: { "P": "Polynomialzeit-entscheidbar", "NP": "Nichtdeterministisch polynomialzeit-verifizierbar" },
          tags: ["complexity", "p-np", "open-problem"]
        },
        {
          id: "bqp-definition",
          name: "BQP (Quanten-Polynomialzeit)",
          latex: "\\text{BPP} \\subseteq \\text{BQP} \\subseteq \\text{PSPACE}",
          description: "Klasse der von Quantencomputern in Polynomialzeit lösbaren Probleme.",
          variables: { "BPP": "Probabilistische Polynomialzeit", "BQP": "Quanten-Polynomialzeit", "PSPACE": "Polynomialer Speicherplatz" },
          tags: ["complexity", "bqp", "quantum"]
        },
        {
          id: "np-completeness",
          name: "Cook-Levin-Theorem",
          latex: "\\text{SAT} \\in \\text{NP-vollständig} \\implies \\forall L \\in \\text{NP}, L \\leq_p \\text{SAT}",
          description: "Boolesche Erfüllbarkeit ist NP-vollständig — jedes NP-Problem ist auf SAT reduzierbar.",
          variables: { "SAT": "Boolesches Erfüllbarkeitsproblem", "\\leq_p": "Polynomialzeit-Reduktion", "NP": "Nichtdeterministisch polynomial" },
          tags: ["complexity", "sat", "np-complete"]
        }
      ]
    }
  ]
};
