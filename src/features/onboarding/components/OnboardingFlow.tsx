import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Network, User, Database, Bot, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';

const STEPS = [
  {
    title: 'Willkommen bei Web 4.0',
    icon: Network,
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p className="text-lg">Web 4.0 ist die nächste Evolution des Internets – <span className="text-primary font-semibold">dezentral, intelligent und souverän</span>.</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><span className="text-primary">●</span> <span><strong className="text-foreground">Deine Daten gehören dir</strong> – verschlüsselt in persönlichen Data Pods</span></li>
          <li className="flex items-start gap-2"><span className="text-secondary">●</span> <span><strong className="text-foreground">KI-Agenten arbeiten für dich</strong> – autonom und transparent</span></li>
          <li className="flex items-start gap-2"><span className="text-accent">●</span> <span><strong className="text-foreground">OMNI-GENESIS Engine</strong> – mathematische Simulationen der Lex Universalis</span></li>
        </ul>
        <p className="text-sm">Kein technisches Wissen nötig – wir führen dich Schritt für Schritt.</p>
      </div>
    ),
  },
  {
    title: 'Deine Digitale Identität',
    icon: User,
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p>Dein Profil ist bereits erstellt. In Web 4.0 hast du eine <span className="text-primary font-semibold">dezentrale Identität (DID)</span> – unabhängig von Google, Facebook oder anderen Konzernen.</p>
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-bold text-foreground text-sm mb-2">Was bedeutet das?</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Du kontrollierst, wer deine Daten sehen kann</li>
            <li>✓ Keine zentrale Stelle kann deinen Account löschen</li>
            <li>✓ Du entscheidest über jede Datenfreigabe</li>
          </ul>
        </div>
        <p className="text-sm">Du kannst dein Profil jederzeit in den Einstellungen anpassen.</p>
      </div>
    ),
  },
  {
    title: 'Dein Erster Data Pod',
    icon: Database,
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p>Ein <span className="text-primary font-semibold">Data Pod</span> ist dein persönlicher, verschlüsselter Datenspeicher. Nur du hast den Schlüssel.</p>
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-bold text-foreground text-sm mb-2">So funktioniert es:</h4>
          <ul className="text-sm space-y-1">
            <li>🔒 AES-256-GCM Verschlüsselung – militärischer Standard</li>
            <li>📦 Speichere Notizen, Dokumente, Schlüssel</li>
            <li>🔑 Nur mit deinem Master-Passwort entschlüsselbar</li>
          </ul>
        </div>
        <p className="text-sm">Gehe nach dem Onboarding zu <span className="text-primary">Data Pods</span>, um deinen ersten Pod zu erstellen.</p>
      </div>
    ),
  },
  {
    title: 'Dein Erster Agent',
    icon: Bot,
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p><span className="text-secondary font-semibold">KI-Agenten</span> sind autonome Helfer, die für dich arbeiten – transparent und unter deiner Kontrolle.</p>
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <h4 className="font-bold text-foreground text-sm mb-2">Verfügbare Agenten:</h4>
          <ul className="text-sm space-y-1">
            <li>🤖 <strong className="text-foreground">Web4 Assistent</strong> – beantwortet deine Fragen zu Web 4.0</li>
            <li>🛡️ <strong className="text-foreground">Privacy Guardian</strong> – überwacht deine Datenschutz-Einstellungen</li>
            <li>🧠 <strong className="text-foreground">Knowledge Agent</strong> – verbindet Wissen automatisch</li>
          </ul>
        </div>
        <p className="text-sm">Besuche den <span className="text-secondary">Agenten-Marktplatz</span>, um deinen ersten Agenten zu installieren.</p>
      </div>
    ),
  },
];

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Progress value={progress} className="mb-6 h-2" />
      <div className="text-sm text-muted-foreground mb-4">
        Schritt {step + 1} von {STEPS.length}
      </div>

      <Card className="p-6 md:p-8 bg-card border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <currentStep.icon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
        </div>

        {currentStep.content}

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Button>

          <Button
            variant="ghost"
            onClick={handleFinish}
            className="text-muted-foreground gap-1"
          >
            <SkipForward className="w-4 h-4" /> Überspringen
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-1">
              Weiter <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gap-1">
              Los geht's! <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
