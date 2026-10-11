import React, { useState } from 'react';
import { Calendar, Sprout, Snowflake, Shovel, Download, CheckCircle2, ThermometerSun, AlertCircle } from 'lucide-react';
import { USDA_ZONES, OCTOBER_CROPS } from '../data/outdoorData';
import { HardinessZoneData, FrostCrop } from '../types';

interface GardenPlannerViewProps {
  isHighContrast: boolean;
}

export const GardenPlannerView: React.FC<GardenPlannerViewProps> = ({ isHighContrast }) => {
  const [selectedZone, setSelectedZone] = useState<HardinessZoneData>(USDA_ZONES[2]); // Default Zone 6
  const [filterType, setFilterType] = useState<string>('all');
  const [checkedCrops, setCheckedCrops] = useState<Record<string, boolean>>({});

  const toggleCropChecked = (id: string) => {
    setCheckedCrops((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCrops = OCTOBER_CROPS.filter((c) => {
    if (filterType === 'all') return true;
    return c.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const exportIcsCalendar = () => {
    const calendarEvents = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Touch Grass AI//Frost Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:garlic-october-plant@touchgrass.ai',
      'SUMMARY:Touch Grass: Plant Garlic Cloves & Spring Bulbs',
      'DESCRIPTION:Plant hardneck garlic cloves 2-3 inches deep pointy side up. Add 4 inches straw mulch.',
      'DTSTART:20261015T140000Z',
      'DTEND:20261015T160000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:mulch-winter-beds@touchgrass.ai',
      'SUMMARY:Touch Grass: Winter Garden Mulch & Root Protection',
      'DESCRIPTION:Spread leaves and straw mulch over overwintering spinach and kale beds before ground freezes.',
      'DTSTART:20261025T140000Z',
      'DTEND:20261025T160000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendarEvents], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `frost-garden-schedule-${selectedZone.zone.split(' ')[1]}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isHighContrast ? 'bg-amber-100/70 border-amber-300 text-stone-800' : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-700 text-white mt-0.5">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">FrostCycle Agronomy: What to Plant This Week</h2>
            <p className="text-xs sm:text-sm opacity-90">
              Calculates your local microclimate frost window. Get your hands in the soil planting garlic, cover crops, and cold-sweetened spinach.
            </p>
          </div>
        </div>
        <button
          onClick={exportIcsCalendar}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Export Offline Calendar (.ics)</span>
        </button>
      </div>

      {/* Zone Selector Bar */}
      <div className={`p-5 rounded-2xl border ${
        isHighContrast ? 'bg-white border-amber-200 shadow-sm' : 'bg-stone-900 border-stone-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
              Select USDA Hardiness Microclimate
            </h3>
            <p className={`text-xs ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
              Determines historical first frost dates, freeze thresholds, and planting timing
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {USDA_ZONES.map((zone) => {
              const isSelected = selectedZone.zone === zone.zone;
              return (
                <button
                  key={zone.zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm'
                      : isHighContrast
                      ? 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      : 'border-stone-800 bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {zone.zone.split(' ')[0]} {zone.zone.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Intelligence Card */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl ${
          isHighContrast ? 'bg-amber-50/80 border border-amber-200' : 'bg-stone-950 border border-stone-800'
        }`}>
          <div>
            <div className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${
              isHighContrast ? 'text-stone-500' : 'text-stone-400'
            }`}>
              <Snowflake className="w-3 h-3 text-sky-500" />
              <span>Average First Autumn Frost</span>
            </div>
            <div className={`text-sm font-bold mt-0.5 ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
              {selectedZone.averageFirstFrost}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Window Open Now
            </div>
          </div>

          <div>
            <div className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${
              isHighContrast ? 'text-stone-500' : 'text-stone-400'
            }`}>
              <ThermometerSun className="w-3 h-3 text-amber-500" />
              <span>Winter Extreme Low</span>
            </div>
            <div className={`text-sm font-bold mt-0.5 font-mono ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
              {selectedZone.tempRange}
            </div>
            <div className={`text-[11px] ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
              Last Spring Frost: {selectedZone.averageLastFrost}
            </div>
          </div>

          <div>
            <div className={`text-[10px] uppercase font-semibold ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
              Current Agronomic Status
            </div>
            <p className={`text-xs mt-0.5 leading-snug font-medium ${isHighContrast ? 'text-stone-800' : 'text-stone-200'}`}>
              {selectedZone.currentStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Crop Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shovel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
              Crops To Plant or Overwinter This Week
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-800/20 border border-stone-700/20 text-xs">
            {['all', 'garlic', 'cover crop', 'vegetable', 'bulb'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                  filterType === cat
                    ? 'bg-emerald-600 text-white font-semibold'
                    : isHighContrast ? 'text-stone-700 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((crop) => {
            const isDone = !!checkedCrops[crop.id];
            return (
              <div
                key={crop.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDone
                    ? 'border-emerald-500/50 bg-emerald-500/5 opacity-80'
                    : isHighContrast
                    ? 'bg-white border-stone-200 hover:border-amber-400 shadow-sm'
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      crop.octoberAction.includes('Plant Now')
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {crop.octoberAction}
                    </span>
                    <button
                      onClick={() => toggleCropChecked(crop.id)}
                      className={`text-xs flex items-center gap-1 font-medium cursor-pointer ${
                        isDone ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'fill-emerald-600 text-white' : ''}`} />
                      <span>{isDone ? 'Planted' : 'Mark Done'}</span>
                    </button>
                  </div>

                  <h4 className={`text-base font-bold ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                    {crop.name}
                  </h4>
                  <p className={`text-xs ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
                    Category: {crop.type} · Harvest: {crop.daysToMaturity}
                  </p>

                  <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                    isHighContrast ? 'bg-stone-50 border border-stone-200 text-stone-700' : 'bg-stone-950 border border-stone-800 text-stone-300'
                  }`}>
                    {crop.guidance}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-700/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isHighContrast ? 'text-stone-600' : 'text-stone-400'}`}>
                      Cold Tolerance:
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {crop.frostTolerance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isHighContrast ? 'text-stone-600' : 'text-stone-400'}`}>
                      Companion Plant:
                    </span>
                    <span className={`italic ${isHighContrast ? 'text-stone-700' : 'text-stone-300'}`}>
                      {crop.companionPlant}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Touch Grass Soil Check Card */}
      <div className={`p-4 rounded-xl border border-dashed flex items-start gap-3 ${
        isHighContrast ? 'bg-amber-50 border-amber-300 text-stone-800' : 'bg-stone-900/60 border-stone-700 text-stone-300'
      }`}>
        <Shovel className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider">Touch Grass Tactile Practice: The Soil Crumb Test</h4>
          <p className="text-xs leading-relaxed">
            Grab a handful of garden soil from 3 inches down. Squeeze it lightly into a ball. If it crumbles into rich granular aggregates like dark chocolate cake crumbs, your microbial fungal networks and moisture are ideal for garlic planting. If it forms a sticky ball, let it dry 24 hours before treading on beds.
          </p>
        </div>
      </div>
    </div>
  );
};
