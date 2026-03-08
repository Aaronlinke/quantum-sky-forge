

## Plan: OMNI-GENESIS Hub + Dashboard + Onboarding

### Was gebaut wird

Drei grosse Bausteine, die das Projekt vom Showcase zur nutzbaren Plattform machen:

---

### 1. OMNI-GENESIS Hub (neue Seite `/omni-genesis`)

Eine dedizierte interaktive Seite mit **5 Tabs** -- einer pro Modul:

| Tab | Inhalt |
|-----|--------|
| **Quantum Vacuum** | Virtuelle Teilchen erzeugen, Nullpunktenergie berechnen, Vakuumfluktuationen visualisieren (Canvas) |
| **Time Machine** | H-N-G System vorwärts/rückwärts iterieren, Parameter-Slider (α,β,γ,δ,η), Zustandstabelle + Liniendiagramm (Recharts) |
| **Crypto Lab** | ECDSA Schlüssel generieren, SHA-256 hashen, Mandelbrot-Kryptographie visualisieren |
| **Meta-Matrix** | 12 Archetypen als interaktives Rad, 7-Schicht-System, Singularity-Generator mit Live-Output |
| **Fractal Cosmology** | Ψₙ₊₁ = R(45°)·Ψₙ²+Cᵥₐc live iterieren, Canvas-Mandelbrot mit 45°-Rotation, UCF-Berechnung |

Jeder Tab hat: Parameter-Eingabe, "Berechnen"-Button, Ergebnis-Anzeige, Canvas-Visualisierung.

---

### 2. Zentrales Dashboard (neue Seite `/dashboard`)

Nach Login die Startseite. Zeigt auf einen Blick:

- **Willkommen** mit DID und Profilinfo
- **Data Pods Widget**: Anzahl Pods, Speicher, letzter Zugriff
- **Agenten Widget**: Installierte/aktive Agenten, Quick-Toggle
- **Knowledge Graph Widget**: Knoten/Kanten-Zähler, Mini-Preview
- **OMNI-GENESIS Widget**: Letzte Simulation, Quick-Launch zu den Modulen
- **Neural Core Widget**: Bewusstseinsstatus (aktiv/inaktiv), Kohärenz-Metrik

Alle Widgets sind Cards mit Links zu den jeweiligen Vollseiten.

---

### 3. Onboarding-Flow (für nicht-technische Nutzer)

Ein geführter 4-Schritt-Flow nach erstmaliger Registrierung:

1. **Willkommen**: Was ist Web 4.0? (einfache Sprache, deutsch)
2. **Identität**: Profil vervollständigen, DID erklären
3. **Erster Data Pod**: Automatisch einen Demo-Pod erstellen
4. **Erster Agent**: Web4-Assistenten installieren

Progress-Bar oben, "Weiter"/"Zurück"-Buttons, "Überspringen"-Option.

---

### Technische Umsetzung

**Neue Dateien:**
- `src/pages/OmniGenesisHub.tsx` -- Hub mit Tabs-Komponente
- `src/features/omni-genesis/components/QuantumVacuumTab.tsx`
- `src/features/omni-genesis/components/TimeMachineTab.tsx`
- `src/features/omni-genesis/components/CryptoLabTab.tsx`
- `src/features/omni-genesis/components/MetaMatrixTab.tsx`
- `src/features/omni-genesis/components/FractalCosmologyTab.tsx`
- `src/pages/Dashboard.tsx` -- Zentrales Dashboard
- `src/features/onboarding/components/OnboardingFlow.tsx`

**Änderungen:**
- `src/app/Router.tsx` -- Neue Routes `/omni-genesis`, `/dashboard`
- `src/components/layout/Header.tsx` -- Navigation ergänzen (Dashboard, OMNI-GENESIS Hub)
- `src/pages/Auth.tsx` -- Nach Login Redirect zu `/dashboard` statt `/`
- `src/hooks/useAuth.tsx` -- `isNewUser`-Flag für Onboarding-Erkennung

**Genutzte bestehende Libs:**
- Alle `src/lib/omni-genesis/*` Module direkt importiert und aufgerufen
- Recharts für Diagramme (bereits installiert)
- Radix Tabs für Tab-Navigation
- Canvas API für Fraktal/Quantum-Visualisierungen

---

### Reihenfolge der Implementierung

1. OMNI-GENESIS Hub mit allen 5 Tabs (grösster Baustein)
2. Dashboard-Seite mit Widgets
3. Onboarding-Flow
4. Header/Router-Updates

