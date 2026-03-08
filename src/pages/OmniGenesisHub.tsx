import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Atom, Clock, Key, Grid3X3, Orbit } from 'lucide-react';
import QuantumVacuumTab from '@/features/omni-genesis/components/QuantumVacuumTab';
import TimeMachineTab from '@/features/omni-genesis/components/TimeMachineTab';
import CryptoLabTab from '@/features/omni-genesis/components/CryptoLabTab';
import MetaMatrixTab from '@/features/omni-genesis/components/MetaMatrixTab';
import FractalCosmologyTab from '@/features/omni-genesis/components/FractalCosmologyTab';

const OmniGenesisHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">OMNI-GENESIS Hub</h1>
        <p className="text-muted-foreground">
          Interaktive Module der Lex Universalis – Mathematische Engines live erleben
        </p>
      </div>

      <Tabs defaultValue="quantum" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5">
          <TabsTrigger value="quantum" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Atom className="w-4 h-4" /> Quantum Vacuum
          </TabsTrigger>
          <TabsTrigger value="timemachine" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Clock className="w-4 h-4" /> Time Machine
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Key className="w-4 h-4" /> Crypto Lab
          </TabsTrigger>
          <TabsTrigger value="metamatrix" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Grid3X3 className="w-4 h-4" /> Meta-Matrix
          </TabsTrigger>
          <TabsTrigger value="fractal" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Orbit className="w-4 h-4" /> Fractal Cosmology
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quantum" className="mt-6">
          <QuantumVacuumTab />
        </TabsContent>
        <TabsContent value="timemachine" className="mt-6">
          <TimeMachineTab />
        </TabsContent>
        <TabsContent value="crypto" className="mt-6">
          <CryptoLabTab />
        </TabsContent>
        <TabsContent value="metamatrix" className="mt-6">
          <MetaMatrixTab />
        </TabsContent>
        <TabsContent value="fractal" className="mt-6">
          <FractalCosmologyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OmniGenesisHub;
