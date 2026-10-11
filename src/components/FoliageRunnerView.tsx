import React, { useState } from 'react';
import { MapPin, Navigation, Trees, Printer, Download, EyeOff, Mountain, Compass, Wind } from 'lucide-react';
import { FOLIAGE_ROUTES } from '../data/outdoorData';
import { FoliageRoute } from '../types';

interface FoliageRunnerViewProps {
  isHighContrast: boolean;
  onOpenPocketMode: () => void;
}

export const FoliageRunnerView: React.FC<FoliageRunnerViewProps> = ({
  isHighContrast,
  onOpenPocketMode,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<FoliageRoute>(FOLIAGE_ROUTES[0]);
  const [showPocketCardModal, setShowPocketCardModal] = useState<boolean>(false);

  const downloadPocketCueText = () => {
    const lines = [
      `=========================================`,
      `TOUCH GRASS RUN CLUB · POCKET CUE CARD`,
      `Route: ${selectedRoute.name}`,
      `Region: ${selectedRoute.region}`,
      `Distance: ${selectedRoute.distanceKm} km · Gain: +${selectedRoute.elevationGainM}m`,
      `Foliage Status: ${selectedRoute.foliageStage} (${selectedRoute.canopyDensity}% Canopy)`,
      `Surface: ${selectedRoute.surfaceType}`,
      `=========================================`,
      `TURN-BY-TURN WAYPOINTS:`,
      ...selectedRoute.waypoints.map(
        (w) => `[${w.distanceKm.toFixed(1)} km] ${w.title} (${w.elevation}m)\n  -> ${w.description}`
      ),
      `=========================================`,
      `RUN CLUB FIELD ADVICE:`,
      selectedRoute.runClubTips,
      `=========================================`,
      `LEAVE THE PHONE IN YOUR POCKET. ENJOY THE FOREST RUN!`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRoute.id}-pocket-cue.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isHighContrast ? 'bg-amber-100/70 border-amber-300 text-stone-800' : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-700 text-white mt-0.5">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Autumn Foliage Run Club: Route Architect</h2>
            <p className="text-xs sm:text-sm opacity-90">
              Generated scenic tree-canopy running loops with elevation profiles and pocket cue sheets. Print or fold in your pocket so you run without staring at glass.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPocketCueText}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pocket Cue (.txt)</span>
          </button>
        </div>
      </div>

      {/* Route Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FOLIAGE_ROUTES.map((route) => {
          const isSelected = selectedRoute.id === route.id;
          return (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isHighContrast
                    ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/40 shadow-sm'
                    : 'border-amber-500 bg-stone-900 ring-2 ring-amber-500/40 shadow-sm'
                  : isHighContrast
                  ? 'border-stone-200 bg-white hover:bg-stone-50'
                  : 'border-stone-800 bg-stone-900/60 hover:bg-stone-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isHighContrast ? 'text-amber-800' : 'text-amber-400'
                  }`}>
                    {route.region}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-stone-700 text-stone-200'
                  }`}>
                    {route.distanceKm} km
                  </span>
                </div>
                <h3 className={`text-base font-bold ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                  {route.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700/20 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 opacity-80">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>+{route.elevationGainM}m Gain</span>
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {route.foliageStage}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Route Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Elevation Profile & Route Map Overview */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-5 rounded-2xl border ${
            isHighContrast ? 'bg-white border-amber-200 shadow-sm' : 'bg-stone-900 border-stone-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                  Elevation Profile & Canopy Density
                </h3>
                <p className={`text-xs ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
                  Surface: {selectedRoute.surfaceType} · Canopy Shade: {selectedRoute.canopyDensity}%
                </p>
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isHighContrast ? 'bg-amber-100 text-amber-900' : 'bg-amber-950 text-amber-300'
              }`}>
                Peak Foliage Week
              </span>
            </div>

            {/* Interactive Elevation SVG */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 relative">
              <svg viewBox="0 0 500 160" className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#333" strokeDasharray="3,3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#333" strokeDasharray="3,3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#333" strokeDasharray="3,3" />

                {/* Elevation Curve Polygon */}
                {(() => {
                  const points = selectedRoute.waypoints;
                  const maxDist = selectedRoute.distanceKm;
                  const minEle = Math.min(...points.map((p) => p.elevation));
                  const maxEle = Math.max(...points.map((p) => p.elevation));
                  const rangeEle = maxEle - minEle || 1;

                  const coords = points.map((p) => {
                    const x = (p.distanceKm / maxDist) * 480 + 10;
                    const y = 140 - ((p.elevation - minEle) / rangeEle) * 100;
                    return { x, y, ele: p.elevation, dist: p.distanceKm, title: p.title };
                  });

                  const pathStr = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                  const fillStr = `${pathStr} L ${coords[coords.length - 1].x} 150 L ${coords[0].x} 150 Z`;

                  return (
                    <>
                      <path d={fillStr} fill="url(#elevationGrad)" />
                      <path d={pathStr} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      {coords.map((c, i) => (
                        <g key={i}>
                          <circle cx={c.x} cy={c.y} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                          <text x={c.x} y={c.y - 10} fill="#d1d5db" fontSize="9" textAnchor="middle">
                            {c.ele}m
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mt-2">
                <span>0.0 km (Start)</span>
                <span>Elevation Gain: +{selectedRoute.elevationGainM}m</span>
                <span>{selectedRoute.distanceKm} km (Finish)</span>
              </div>
            </div>

            {/* Autumn Highlights */}
            <div className="mt-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isHighContrast ? 'text-stone-700' : 'text-stone-300'}`}>
                Canopy Highlights Along Route
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoute.highlights.map((h, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                      isHighContrast ? 'bg-amber-50 border-amber-200 text-stone-800' : 'bg-stone-800/80 border-stone-700 text-stone-300'
                    }`}
                  >
                    🍂 {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Waypoints Cue Sheet & Run Club Advice */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-5 rounded-2xl border ${
            isHighContrast ? 'bg-white border-amber-200 shadow-sm' : 'bg-stone-900 border-stone-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                Turn-by-Turn Trail Cue Sheet
              </h3>
              <button
                onClick={() => setShowPocketCardModal(true)}
                className={`text-xs font-medium flex items-center gap-1 underline cursor-pointer ${
                  isHighContrast ? 'text-amber-800' : 'text-amber-400'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Pocket Slip</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedRoute.waypoints.map((wp, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isHighContrast ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {wp.distanceKm.toFixed(1)}k
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isHighContrast ? 'text-stone-900' : 'text-stone-200'}`}>
                        {wp.title}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-400">
                        {wp.elevation}m
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isHighContrast ? 'text-stone-600' : 'text-stone-400'}`}>
                      {wp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Club Field Advice */}
            <div className={`mt-4 p-4 rounded-xl border ${
              isHighContrast ? 'bg-amber-50/60 border-amber-200 text-stone-800' : 'bg-stone-800/50 border-stone-700 text-stone-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Run Club Trail Protocol</h4>
              </div>
              <p className="text-xs leading-relaxed">
                {selectedRoute.runClubTips}
              </p>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={downloadPocketCueText}
                className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline Cue Card</span>
              </button>
              <button
                onClick={onOpenPocketMode}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Screen Off</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pocket Cue Slip Modal */}
      {showPocketCardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border-4 border-amber-600 space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800">
                  Cut & Fold Pocket Cue Slip
                </h3>
                <p className="text-xs text-stone-600">
                  Designed for folding into a runner vest pocket. Zero screen needed.
                </p>
              </div>
              <button
                onClick={() => setShowPocketCardModal(false)}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 font-mono text-xs space-y-2">
              <div className="font-bold border-b border-amber-200 pb-1">
                {selectedRoute.name.toUpperCase()} · {selectedRoute.distanceKm}KM
              </div>
              {selectedRoute.waypoints.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="font-bold text-amber-700">[{w.distanceKm.toFixed(1)}k]</span>
                  <span>{w.title}: {w.description}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-stone-900 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Cue Slip</span>
              </button>
              <button
                onClick={downloadPocketCueText}
                className="flex-1 py-2 rounded-lg bg-amber-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save as .txt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
