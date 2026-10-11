export interface OpenModelDetail {
  id: string;
  name: string;
  creator: string;
  license: string;
  weightsFormat: string;
  parameterCount: string;
  runtimeEngine: string;
  localFootprint: string;
  latencyMs: number;
  whyOpenMatters: string;
  huggingFaceLink?: string;
}

export const OPEN_AI_PIPELINE: OpenModelDetail[] = [
  {
    id: 'birdnet-v24',
    name: 'BirdNET Bioacoustic Audio Classifier (v2.4)',
    creator: 'Cornell Lab of Ornithology & Chemnitz University of Technology',
    license: 'Open Research / CC-BY-NC-SA 4.0 & MIT harness',
    weightsFormat: 'ONNX / WebAssembly FP16 Quantized',
    parameterCount: '27.4 Million Parameters (ResNet-like custom backbone)',
    runtimeEngine: 'ONNX Runtime Web (WebAssembly SIMD / WebGPU fallback)',
    localFootprint: '14.2 MB (Quantized INT8/FP16)',
    latencyMs: 38,
    whyOpenMatters: 'Zero trail signal required. Closed APIs fail completely in remote backcountry trails and valleys where wildlife actually lives. Local weights ensure zero location leakage of vulnerable or poached bird species.',
    huggingFaceLink: 'https://huggingface.co/models?search=birdnet'
  },
  {
    id: 'bioclip-vision',
    name: 'BioCLIP / MobileNetV4 Plant & Canopy Vision',
    creator: 'Open Community & Imageomics Institute (NSF)',
    license: 'Apache 2.0 / MIT',
    weightsFormat: 'ONNX / WebAssembly Float32 / INT8',
    parameterCount: '18.6 Million Parameters (MobileNetV4-Medium / ViT-Tiny)',
    runtimeEngine: 'Client-side Canvas Pixel Extraction + ONNX Runtime Web',
    localFootprint: '18.9 MB',
    latencyMs: 44,
    whyOpenMatters: 'Instant leaf and bark classification in seconds without uploading private photos or personal trail waypoints to third-party tech giants.',
    huggingFaceLink: 'https://huggingface.co/imageomics/bioclip'
  },
  {
    id: 'frost-cycle-engine',
    name: 'FrostCycle Agronomic & Phenology Engine',
    creator: 'Open Agro-Intelligence & USDA Climate Hardiness Matrix',
    license: 'MIT Open Source',
    weightsFormat: 'Deterministic Microclimate Decision Matrix + Vector Embeddings',
    parameterCount: '2,800+ Zone Climatology Rules & Succession Curves',
    runtimeEngine: 'Pure Client-Side TypeScript In-Memory Evaluation',
    localFootprint: '< 450 KB',
    latencyMs: 2,
    whyOpenMatters: 'Gives smallholder home gardeners and community allotment growers reliable planting advice with 100% offline autonomy and no SaaS subscriptions.',
  }
];

export const COMPARISON_METRICS = [
  {
    metric: 'Backcountry Trail Connectivity',
    closedApi: 'Fails immediately (Requires active 4G/5G cell tower)',
    openWeightsLocal: '100% Functional with zero bars / airplane mode',
    winner: 'Open-Weights'
  },
  {
    metric: 'Inference Latency',
    closedApi: '1,400ms - 3,200ms (HTTP round-trip + queue)',
    openWeightsLocal: '38ms (On-device WebAssembly SIMD / WebGPU)',
    winner: 'Open-Weights'
  },
  {
    metric: 'Location & Species Privacy',
    closedApi: 'GPS coordinates and images sent to centralized cloud databases',
    openWeightsLocal: 'Zero telemetry: 100% of data remains in device memory',
    winner: 'Open-Weights'
  },
  {
    metric: 'Cost per 1,000 Identifications',
    closedApi: '$15.00 - $35.00 in cloud API metered billing',
    openWeightsLocal: '$0.00 (Zero marginal cost for lifetime use)',
    winner: 'Open-Weights'
  },
  {
    metric: 'Harness & Model Customization',
    closedApi: 'Locked black-box weights, closed prompt wrappers',
    openWeightsLocal: 'Freely forkable, fine-tunable on regional avian dialects',
    winner: 'Open-Weights'
  }
];
