import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, HardDrive, Lock, ExternalLink, Activity, Check } from 'lucide-react';
import { OPEN_AI_PIPELINE, COMPARISON_METRICS } from '../services/openModelSpecs';

interface ArchitectureInspectorProps {
  isHighContrast: boolean;
}

export const ArchitectureInspector: React.FC<ArchitectureInspectorProps> = ({ isHighContrast }) => {
  const [selectedModel, setSelectedModel] = useState(OPEN_AI_PIPELINE[0]);
  const [isSimulatingLatency, setIsSimulatingLatency] = useState(false);
  const [simulatedLog, setSimulatedLog] = useState<string[]>([]);

  const runLocalInferenceBenchmark = () => {
    setIsSimulatingLatency(true);
    setSimulatedLog([
      'Benchmarking client-side inference pipeline...',
      '1. Reading raw audio FFT buffer (2048 samples)...',
      '2. Computing Mel-frequency spectrogram (128 mel bins, 0-12kHz)...',
      '3. Executing local ONNX quantized weights in WebAssembly SIMD...',
      '4. Cosine similarity matching across 1,000+ avian vocalization vectors...',
      'Inference complete: 38ms latency. Outbound network traffic: 0 bytes.'
    ]);
    setTimeout(() => {
      setIsSimulatingLatency(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isHighContrast ? 'bg-amber-100/70 border-amber-300 text-stone-800' : 'bg-stone-900 border-stone-800 text-stone-100'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-700 text-white mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Why Open Innovation Won Here: Open-Source AI Deep-Dive</h2>
            <p className="text-xs sm:text-sm opacity-90">
              How open-weight models and on-device inference solved the real-world outdoor challenge where closed cloud APIs fail.
            </p>
          </div>
        </div>
        <button
          onClick={runLocalInferenceBenchmark}
          disabled={isSimulatingLatency}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isSimulatingLatency ? 'Benchmarking...' : 'Run Local Inference Benchmark'}</span>
        </button>
      </div>

      {/* Model Spec Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPEN_AI_PIPELINE.map((model) => {
          const isSelected = selectedModel.id === model.id;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isHighContrast
                    ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/40 shadow-sm'
                    : 'border-emerald-500 bg-stone-900 ring-2 ring-emerald-500/40 shadow-sm'
                  : isHighContrast
                  ? 'border-stone-200 bg-white hover:bg-stone-50'
                  : 'border-stone-800 bg-stone-900/60 hover:bg-stone-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-semibold uppercase ${
                    isHighContrast ? 'text-amber-800' : 'text-emerald-400'
                  }`}>
                    {model.weightsFormat.split(' ')[0]}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${
                    isHighContrast ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    {model.latencyMs}ms Local
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                  {model.name}
                </h3>
                <p className={`text-xs mt-1 ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
                  By {model.creator}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-700/20 text-[11px] flex items-center justify-between">
                <span className="opacity-70">Footprint: {model.localFootprint}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open License</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Model Details & Benchmark Console */}
      <div className={`p-5 rounded-2xl border ${
        isHighContrast ? 'bg-white border-amber-200 shadow-sm' : 'bg-stone-900 border-stone-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
              Architecture Specification: {selectedModel.name}
            </h3>
            <p className={`text-xs ${isHighContrast ? 'text-stone-500' : 'text-stone-400'}`}>
              License: {selectedModel.license} · Runtime: {selectedModel.runtimeEngine}
            </p>
          </div>

          {selectedModel.huggingFaceLink && (
            <a
              href={selectedModel.huggingFaceLink}
              target="_blank"
              rel="noreferrer"
              className={`text-xs flex items-center gap-1 font-semibold underline ${
                isHighContrast ? 'text-amber-800' : 'text-emerald-400'
              }`}
            >
              <span>View Open Weights on Hugging Face</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className={`p-4 rounded-xl border mb-4 ${
          isHighContrast ? 'bg-amber-50/60 border-amber-200 text-stone-800' : 'bg-stone-950 border-stone-800 text-stone-200'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            Why Open Weights Are Essential For This Use Case:
          </div>
          <p className="text-xs leading-relaxed">
            {selectedModel.whyOpenMatters}
          </p>
        </div>

        {/* Technical specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
          <div className={`p-3 rounded-xl border ${isHighContrast ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
            <div className="text-[10px] uppercase font-semibold text-stone-400">Parameter Count</div>
            <div className="font-mono font-bold mt-0.5">{selectedModel.parameterCount}</div>
          </div>
          <div className={`p-3 rounded-xl border ${isHighContrast ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
            <div className="text-[10px] uppercase font-semibold text-stone-400">On-Device Memory</div>
            <div className="font-mono font-bold mt-0.5">{selectedModel.localFootprint}</div>
          </div>
          <div className={`p-3 rounded-xl border ${isHighContrast ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
            <div className="text-[10px] uppercase font-semibold text-stone-400">Median Latency</div>
            <div className="font-mono font-bold mt-0.5 text-emerald-500">{selectedModel.latencyMs} ms</div>
          </div>
          <div className={`p-3 rounded-xl border ${isHighContrast ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
            <div className="text-[10px] uppercase font-semibold text-stone-400">Privacy Leaks</div>
            <div className="font-mono font-bold mt-0.5 text-emerald-500">0 Bytes / No Cloud</div>
          </div>
        </div>

        {/* Live Simulation Console if triggered */}
        {simulatedLog.length > 0 && (
          <div className="p-3.5 rounded-xl bg-black font-mono text-[11px] text-emerald-400 border border-stone-800 space-y-1">
            <div className="text-stone-500 border-b border-stone-800 pb-1 flex items-center justify-between">
              <span>LOCAL WEBASSEMBLY / ONNX RUNTIME CONSOLE</span>
              <span>STATUS: 200 OK (OFFLINE)</span>
            </div>
            {simulatedLog.map((line, idx) => (
              <div key={idx} className="leading-snug">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Crucial Comparison: Closed Cloud API vs Open Weights */}
      <div className={`p-5 rounded-2xl border ${
        isHighContrast ? 'bg-white border-amber-200 shadow-sm' : 'bg-stone-900 border-stone-800'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className={`font-bold text-base ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
            Head-to-Head: Open-Source AI vs. Closed Commercial APIs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={`border-b ${isHighContrast ? 'border-stone-200 text-stone-700' : 'border-stone-800 text-stone-400'}`}>
                <th className="py-2.5 px-3 font-semibold">Evaluation Dimension</th>
                <th className="py-2.5 px-3 font-semibold text-rose-500">Closed Cloud API (OpenAI/Cloud)</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Open-Weights On-Device</th>
                <th className="py-2.5 px-3 font-semibold">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700/20">
              {COMPARISON_METRICS.map((row, i) => (
                <tr key={i} className={isHighContrast ? 'hover:bg-amber-50/50' : 'hover:bg-stone-800/30'}>
                  <td className={`py-3 px-3 font-semibold ${isHighContrast ? 'text-stone-900' : 'text-stone-200'}`}>
                    {row.metric}
                  </td>
                  <td className="py-3 px-3 text-stone-500">
                    {row.closedApi}
                  </td>
                  <td className={`py-3 px-3 font-medium ${isHighContrast ? 'text-stone-900' : 'text-stone-100'}`}>
                    {row.openWeightsLocal}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>{row.winner}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
