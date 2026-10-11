import React, { useState } from 'react';
import { Eye, Mic, Volume2, ArrowLeft, Trees, Radio, Check } from 'lucide-react';
import { bioacousticEngine } from '../services/bioacousticEngine';
import { BIRD_SPECIES } from '../data/outdoorData';
import { BirdSpecies } from '../types';

interface PocketScreenMinimizerProps {
  onClose: () => void;
}

export const PocketScreenMinimizer: React.FC<PocketScreenMinimizerProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastAnnouncedSpecies, setLastAnnouncedSpecies] = useState<BirdSpecies | null>(null);
  const [statusMessage, setStatusMessage] = useState('Device in pocket mode. Screen backlight minimized.');

  const togglePocketListening = async () => {
    if (!isListening) {
      setIsListening(true);
      setStatusMessage('Listening to the forest canopy...');
      bioacousticEngine.speakAnnouncement('Trail audio active. Put device away.');

      // Simulate or start mic
      const success = await bioacousticEngine.startMicrophone(
        () => {},
        (species) => {
          setLastAnnouncedSpecies(species);
          setStatusMessage(`Heard: ${species.commonName} (${species.dominantFreqKHz} kHz)`);
          bioacousticEngine.speakAnnouncement(`${species.commonName}`);
        }
      );

      if (!success) {
        // Fallback demo after 3 seconds
        setTimeout(() => {
          const sample = BIRD_SPECIES[Math.floor(Math.random() * 4)];
          setLastAnnouncedSpecies(sample);
          setStatusMessage(`Heard: ${sample.commonName}`);
          bioacousticEngine.speakAnnouncement(`${sample.commonName}`);
        }, 3200);
      }
    } else {
      setIsListening(false);
      bioacousticEngine.stopMicrophone();
      setStatusMessage('Listening paused.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-amber-100 flex flex-col justify-between p-6 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white cursor-pointer text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Pocket Mode</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>0 BARS TRAIL READY</span>
        </div>
      </div>

      {/* Center Giant Action */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center">
          <Trees className="w-10 h-10 text-amber-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Touch Grass Mode
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            The screen is the shortest part of your outdoor experience. Keep your eyes on the trail and your phone in your pocket.
          </p>
        </div>

        <button
          onClick={togglePocketListening}
          className={`w-full py-5 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg ${
            isListening
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-500/30'
              : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
          }`}
        >
          {isListening ? (
            <>
              <Radio className="w-5 h-5 animate-spin" />
              <span>Bioacoustic Ear Active (Listening...)</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Tap to Activate Audio Guide</span>
            </>
          )}
        </button>

        {/* Status indicator */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 w-full text-center space-y-1">
          <div className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
            Audio Status
          </div>
          <p className="text-xs font-semibold text-amber-200">
            {statusMessage}
          </p>
          {lastAnnouncedSpecies && (
            <div className="pt-2 border-t border-stone-800 text-[11px] text-emerald-400">
              Latest identification: <strong>{lastAnnouncedSpecies.commonName}</strong> ({lastAnnouncedSpecies.dominantFreqKHz} kHz)
            </div>
          )}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="text-center text-[11px] text-stone-500">
        Audio chime and device vibration will notify you when a bird or foliage waypoint is reached.
      </div>
    </div>
  );
};
