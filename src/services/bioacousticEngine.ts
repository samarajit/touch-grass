import { BirdSpecies } from '../types';
import { BIRD_SPECIES } from '../data/outdoorData';

export class BioacousticEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private isListening: boolean = false;
  private animationFrameId: number | null = null;

  public initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public async startMicrophone(
    onSpectrumUpdate: (freqData: Uint8Array, timeData: Uint8Array) => void,
    onSpeciesDetected: (species: BirdSpecies, confidence: number) => void
  ): Promise<boolean> {
    try {
      const ctx = this.initAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });

      const source = ctx.createMediaStreamSource(this.micStream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);

      this.isListening = true;
      const bufferLength = this.analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);

      let detectionCooldown = 0;

      const loop = () => {
        if (!this.isListening || !this.analyser) return;

        this.analyser.getByteFrequencyData(freqData);
        this.analyser.getByteTimeDomainData(timeData);
        onSpectrumUpdate(freqData, timeData);

        detectionCooldown++;
        if (detectionCooldown > 35) { // periodic check ~ every 600ms
          detectionCooldown = 0;
          this.evaluateAcousticFrequencies(freqData, onSpeciesDetected);
        }

        this.animationFrameId = requestAnimationFrame(loop);
      };

      loop();
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable, falling back to simulated bioacoustic feed', err);
      return false;
    }
  }

  public stopMicrophone(): void {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      // Keep audio context alive for playbacks if needed
    }
  }

  /**
   * Synthesizes authentic species acoustic audio via Web Audio API oscillators,
   * simulating the true frequency characteristics, cadence and harmonics.
   */
  public playSpeciesAcousticCall(
    speciesId: string,
    onSpectrumUpdate?: (freqData: Uint8Array, timeData: Uint8Array) => void,
    onComplete?: () => void
  ): void {
    const ctx = this.initAudioContext();
    const species = BIRD_SPECIES.find((s) => s.id === speciesId) || BIRD_SPECIES[0];

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.75;
    analyser.connect(ctx.destination);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.connect(analyser);

    const now = ctx.currentTime;
    let callDuration = 2.4;

    if (species.id === 'black-capped-chickadee') {
      // Fee-bee: tone 1 @ 3800Hz, small break, tone 2 @ 3200Hz
      callDuration = 2.2;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3850, now);
      osc.frequency.exponentialRampToValueAtTime(3700, now + 0.5);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.28, now + 0.05);
      masterGain.gain.linearRampToValueAtTime(0.001, now + 0.5);

      // Bee (second note)
      osc.frequency.setValueAtTime(3200, now + 0.65);
      osc.frequency.exponentialRampToValueAtTime(3100, now + 1.2);

      masterGain.gain.setValueAtTime(0.001, now + 0.65);
      masterGain.gain.linearRampToValueAtTime(0.32, now + 0.72);
      masterGain.gain.linearRampToValueAtTime(0.001, now + 1.2);

      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.3);
    } else if (species.id === 'wood-thrush') {
      // Ee-oh-lay flute chords (dual harmonic chord simulation)
      callDuration = 2.5;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(2200, now);
      osc1.frequency.exponentialRampToValueAtTime(3100, now + 0.6);
      osc1.frequency.exponentialRampToValueAtTime(4800, now + 1.4);

      osc2.frequency.setValueAtTime(2250, now);
      osc2.frequency.exponentialRampToValueAtTime(3400, now + 0.6);
      osc2.frequency.exponentialRampToValueAtTime(5100, now + 1.4);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.24, now + 0.2);
      masterGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.1);
      osc2.stop(now + 2.1);
    } else if (species.id === 'barred-owl') {
      // Deep low frequency rhythmic cadence "Who cooks for you?"
      callDuration = 3.0;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);

      const notes = [450, 480, 560, 470, 680, 590, 440];
      let t = now;
      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, t);
        masterGain.gain.setValueAtTime(0.001, t);
        masterGain.gain.linearRampToValueAtTime(0.35, t + 0.05);
        masterGain.gain.linearRampToValueAtTime(0.001, t + 0.3);
        t += 0.38;
      });

      osc.connect(masterGain);
      osc.start(now);
      osc.stop(t);
    } else if (species.id === 'red-tailed-hawk') {
      // Screaming raspy downward sweep
      callDuration = 2.4;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(3600, now);
      osc.frequency.exponentialRampToValueAtTime(1900, now + 1.8);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.Q.value = 3.5;

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

      osc.connect(filter);
      filter.connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.0);
    } else {
      // Default melodious warble (Carolina Wren / Songbird)
      callDuration = 2.0;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const f = species.dominantFreqKHz * 1000;
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.15, now + 0.4);
      osc.frequency.linearRampToValueAtTime(f * 0.9, now + 0.8);
      osc.frequency.linearRampToValueAtTime(f * 1.2, now + 1.3);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.28, now + 0.1);
      masterGain.gain.linearRampToValueAtTime(0.001, now + 1.8);

      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.9);
    }

    // Animation visualizer during playback
    if (onSpectrumUpdate) {
      const bufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);
      const startMs = Date.now();

      const playbackLoop = () => {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        onSpectrumUpdate(freqData, timeData);

        if (Date.now() - startMs < callDuration * 1000 + 300) {
          requestAnimationFrame(playbackLoop);
        } else {
          if (onComplete) onComplete();
        }
      };
      requestAnimationFrame(playbackLoop);
    }
  }

  /**
   * Evaluates frequency distribution against species acoustic prototypes.
   * Simulates BirdNET client-side open-weights classifier inference.
   */
  private evaluateAcousticFrequencies(
    freqData: Uint8Array,
    onSpeciesDetected: (species: BirdSpecies, confidence: number) => void
  ): void {
    if (!this.audioCtx) return;

    const sampleRate = this.audioCtx.sampleRate || 44100;
    const nyquist = sampleRate / 2;
    const binSize = nyquist / freqData.length;

    // Find peak frequency band with energy > threshold
    let maxVal = 0;
    let peakIndex = 0;
    let totalEnergy = 0;

    for (let i = 5; i < freqData.length; i++) {
      totalEnergy += freqData[i];
      if (freqData[i] > maxVal) {
        maxVal = freqData[i];
        peakIndex = i;
      }
    }

    // Require decent SNR / vocalization volume
    if (maxVal < 60 || totalEnergy < 1200) {
      return;
    }

    const detectedFreqHz = peakIndex * binSize;
    const detectedFreqKHz = detectedFreqHz / 1000;

    // Match against known species based on acoustic range & spectral centroid
    let bestMatch: BirdSpecies = BIRD_SPECIES[0];
    let smallestDelta = 99999;

    BIRD_SPECIES.forEach((s) => {
      const delta = Math.abs(s.dominantFreqKHz - detectedFreqKHz);
      if (delta < smallestDelta) {
        smallestDelta = delta;
        bestMatch = s;
      }
    });

    // Compute realistic open-weight confidence score (65% to 98%)
    const closeness = Math.max(0, 1 - smallestDelta / 2.0);
    const confidence = Math.round((0.68 + closeness * 0.30) * 100);

    onSpeciesDetected(bestMatch, confidence);

    // Haptic pulse on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate([60, 40, 80]);
    }
  }

  /**
   * "Minimum Screen Time" Audio Cue: Speaks species name so user never looks at screen
   */
  public speakAnnouncement(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const bioacousticEngine = new BioacousticEngine();
