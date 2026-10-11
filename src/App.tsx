import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BirdIdentifierView } from './components/BirdIdentifierView';
import { FoliageRunnerView } from './components/FoliageRunnerView';
import { GardenPlannerView } from './components/GardenPlannerView';
import { CanopyLensView } from './components/CanopyLensView';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { SubmissionReportView } from './components/SubmissionReportView';
import { PocketScreenMinimizer } from './components/PocketScreenMinimizer';
import { Compass, Leaf, Shield, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('bird');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isPocketModeOpen, setIsPocketModeOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans ${
      isHighContrast
        ? 'bg-amber-50/40 text-stone-900'
        : 'bg-stone-950 text-stone-100'
    }`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        onOpenPocketMode={() => setIsPocketModeOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'bird' && (
          <BirdIdentifierView
            isHighContrast={isHighContrast}
            onOpenPocketMode={() => setIsPocketModeOpen(true)}
          />
        )}

        {activeTab === 'foliage' && (
          <FoliageRunnerView
            isHighContrast={isHighContrast}
            onOpenPocketMode={() => setIsPocketModeOpen(true)}
          />
        )}

        {activeTab === 'garden' && (
          <GardenPlannerView
            isHighContrast={isHighContrast}
          />
        )}

        {activeTab === 'canopy' && (
          <CanopyLensView
            isHighContrast={isHighContrast}
            onOpenPocketMode={() => setIsPocketModeOpen(true)}
          />
        )}

        {activeTab === 'specs' && (
          <ArchitectureInspector
            isHighContrast={isHighContrast}
          />
        )}

        {activeTab === 'submission' && (
          <SubmissionReportView
            isHighContrast={isHighContrast}
          />
        )}
      </main>

      {/* Pocket Screen Minimizer Fullscreen Overlay */}
      {isPocketModeOpen && (
        <PocketScreenMinimizer
          onClose={() => setIsPocketModeOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className={`border-t py-6 px-4 text-xs transition-colors ${
        isHighContrast ? 'bg-amber-100/50 border-amber-200 text-stone-600' : 'bg-stone-900/60 border-stone-800 text-stone-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Touch Grass AI</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Open-Source AI Challenge Week 1 Submission</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Zero Remote Telemetry</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>WebAssembly & WebGPU Runtimes</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Designed to make the screen the shortest part of your day</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
