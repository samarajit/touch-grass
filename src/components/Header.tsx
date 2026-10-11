import React from 'react';
import { Compass, Volume2, ShieldCheck, Sun, Moon, EyeOff, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  onOpenPocketMode: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isHighContrast,
  setIsHighContrast,
  onOpenPocketMode,
  isOnline,
}) => {
  const tabs = [
    { id: 'bird', label: 'Trail Bioacoustics' },
    { id: 'foliage', label: 'Foliage Run Club' },
    { id: 'garden', label: 'Frost Planner' },
    { id: 'canopy', label: 'Canopy Lens' },
    { id: 'specs', label: 'Open AI Architecture' },
    { id: 'submission', label: 'Hacktoberfest Post' },
  ];

  return (
    <header className={`border-b transition-colors duration-200 ${
      isHighContrast ? 'bg-amber-50/90 border-amber-200' : 'bg-stone-900 border-stone-800 text-stone-100'
    }`}>
      {/* Top Banner: Outdoor Status & Minimal Screen Discipline */}
      <div className={`px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b ${
        isHighContrast ? 'bg-amber-100/70 border-amber-200 text-stone-800' : 'bg-stone-950 border-stone-800 text-stone-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Signal Trail Ready (Open Weights Cached Locally)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400 font-semibold">100% Backcountry Offline Mode Active</span>
              </>
            )}
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="hidden sm:inline">No Cloud Telemetry</span>
          <span aria-hidden="true" className="hidden sm:inline opacity-40">·</span>
          <span className="hidden sm:inline">Inference: In-Browser WebAssembly/WebGPU</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPocketMode}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
            title="Minimize screen, listen via audio & haptics"
          >
            <EyeOff className="w-3 h-3" />
            <span>Pocket Mode (Zero Screen)</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isHighContrast ? 'text-stone-900' : 'text-stone-50'
              }`}>
                Touch Grass AI
              </h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isHighContrast ? 'bg-amber-200/80 text-amber-900' : 'bg-stone-800 text-emerald-400'
              }`}>
                Open-Weight Trail OS
              </span>
            </div>
            <p className={`text-xs sm:text-sm ${
              isHighContrast ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Offline bioacoustic bird identifier, fall foliage runner routes, and frost garden intelligence
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isHighContrast
                ? 'bg-white border-amber-300 text-stone-800 hover:bg-amber-100/50'
                : 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700'
            }`}
            title="Toggle between daylight high-contrast trail mode and forest dark mode"
          >
            {isHighContrast ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Deep Forest Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Trail Sunlight Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className={`px-4 overflow-x-auto scrollbar-none flex items-center gap-1 border-t ${
        isHighContrast ? 'border-amber-200/70' : 'border-stone-800'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1 w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? isHighContrast
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : isHighContrast
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
