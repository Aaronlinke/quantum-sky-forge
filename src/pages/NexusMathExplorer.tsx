import { useState, useMemo, useEffect, useRef } from 'react';
import { nexusDataset, type Formula, type FormulaCategory } from '@/data/nexus-formulas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Flame, Dna, Binary, Orbit, Globe, Grid3X3, Swords, Bitcoin, Zap, Layers, BookOpen } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-4 w-4" />,
  Dna: <Dna className="h-4 w-4" />,
  Binary: <Binary className="h-4 w-4" />,
  Orbit: <Orbit className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  Grid3x3: <Grid3X3 className="h-4 w-4" />,
  Swords: <Swords className="h-4 w-4" />,
  Bitcoin: <Bitcoin className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
};

function LatexRenderer({ latex, displayMode = true }: { latex: string; displayMode?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch {
        ref.current.textContent = latex;
      }
    }
  }, [latex, displayMode]);

  return <div ref={ref} className="overflow-x-auto py-2" />;
}

function FormulaCard({ formula, expanded, onToggle }: { formula: Formula; expanded: boolean; onToggle: () => void }) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm"
      onClick={onToggle}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          {formula.name}
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-background/60 rounded-lg p-4 border border-border/30 mb-3">
          <LatexRenderer latex={formula.latex} />
        </div>
        <p className="text-sm text-muted-foreground mb-3">{formula.description}</p>
        {expanded && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-semibold text-foreground">Variablen</h4>
            <div className="grid gap-2">
              {Object.entries(formula.variables).map(([key, desc]) => (
                <div key={key} className="flex items-start gap-3 bg-muted/30 rounded-md p-2">
                  <div className="min-w-[80px]">
                    <LatexRenderer latex={key} displayMode={false} />
                  </div>
                  <span className="text-sm text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {formula.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NexusMathExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { categories, metadata } = nexusDataset;

  const filteredFormulas = useMemo(() => {
    const q = search.toLowerCase();
    let results: { formula: Formula; category: FormulaCategory }[] = [];

    const cats = activeCategory === 'all' ? categories : categories.filter(c => c.id === activeCategory);

    for (const cat of cats) {
      for (const f of cat.formulas) {
        if (!q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.tags.some(t => t.includes(q)) || f.latex.toLowerCase().includes(q)) {
          results.push({ formula: f, category: cat });
        }
      }
    }
    return results;
  }, [search, activeCategory, categories]);

  const totalFormulas = categories.reduce((sum, c) => sum + c.formulas.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Nexus Mathematics Explorer
          </h1>
          <p className="text-muted-foreground">
            {metadata.version} — {totalFormulas} Formeln in {categories.length} Kategorien
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Formeln, Variablen, Beschreibungen durchsuchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/30 p-1 mb-6">
            <TabsTrigger value="all" className="text-xs">
              Alle ({totalFormulas})
            </TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs flex items-center gap-1">
                {iconMap[cat.icon]}
                <span className="hidden sm:inline">{cat.name}</span>
                <span className="sm:hidden">{cat.name.slice(0, 4)}</span>
                ({cat.formulas.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Category Description */}
          {activeCategory !== 'all' && (
            <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
          )}

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredFormulas.map(({ formula }) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                expanded={expandedId === formula.id}
                onToggle={() => setExpandedId(prev => prev === formula.id ? null : formula.id)}
              />
            ))}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Keine Formeln gefunden für „{search}"
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
