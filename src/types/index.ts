export interface BirdSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  frequencyRange: string; // e.g. "2.1 - 4.8 kHz"
  dominantFreqKHz: number;
  callType: 'Territorial Song' | 'Contact Call' | 'Alarm / Mobbing' | 'Flight Call';
  description: string;
  fieldCue: string; // mnemonic e.g. "Chic-a-dee-dee-dee"
  fallBehavior: string;
  habitat: string;
  iucnStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable';
  confidenceScore?: number;
  sampleFrequencyPattern: number[]; // relative frequency bins for synthetic playback/FFT matching
}

export interface PlantSpecimen {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Deciduous Tree' | 'Conifer' | 'Herbaceous' | 'Fungus' | 'Edible Berry' | 'Toxic Caution';
  fallColor: string;
  pigment: 'Anthocyanins (Red/Purple)' | 'Carotenoids (Yellow/Orange)' | 'Tannins (Russet/Brown)' | 'Chlorophyll Retention';
  barkFeatures: string;
  foragingNotes: string;
  touchGrassAction: string; // prompt to experience it with hands/senses
  imageUrl?: string;
  matchScore?: number;
}

export interface FoliageRoute {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  elevationGainM: number;
  canopyDensity: number; // 0-100%
  foliageStage: 'Early Tint' | 'Near Peak' | 'Peak Vibrancy' | 'Past Peak / Golden Carpet';
  surfaceType: 'Dirt Singletrack' | 'Gravel & Bridle' | 'Paved Greenway' | 'Mixed Forest Road';
  highlights: string[];
  waypoints: {
    distanceKm: number;
    title: string;
    description: string;
    elevation: number;
  }[];
  runClubTips: string;
}

export interface FrostCrop {
  id: string;
  name: string;
  type: 'Cold-Hardy Vegetable' | 'Garlic & Allium' | 'Cover Crop' | 'Spring Bulb' | 'Perennial Prep';
  octoberAction: 'Plant Now (Pre-Freeze)' | 'Direct Seed Before Frost' | 'Mulch & Overwinter' | 'Harvest Before Hard Freeze';
  frostTolerance: 'Light Frost (28-32°F)' | 'Hard Freeze (<25°F)' | 'Extreme Hardiness (<15°F)';
  daysToMaturity: number | string;
  guidance: string;
  companionPlant: string;
}

export interface HardinessZoneData {
  zone: string;
  tempRange: string;
  averageFirstFrost: string;
  averageLastFrost: string;
  currentStatus: string;
  recommendedCrops: string[];
}
